using Microsoft.Azure.Devices;
using Newtonsoft.Json;

namespace IoTHubBackend.Services
{
    public interface IDirectMethodService
    {
        public Task CallDirectMethodAsync(string deviceId, string methodName, string payload, bool awaitAction = false);
        void Setup();
        Task TurnOnFan();
        Task TurnOffFan();
        Task OpenWindow();
        Task CloseWindow();
    }
    public class DirectMethodService : IDirectMethodService
    {
        private readonly IConfigurationService configurationService;
        private readonly ILogger<DirectMethodService> logger;
        private ServiceClient serviceClient;
        private bool fanRunning = false;
        private bool win_open = false;

        public DirectMethodService(IConfigurationService configurationService, ILogger<DirectMethodService> logger)
        {
            this.configurationService = configurationService;
            this.logger = logger;
        }

        public void Setup()
        {
            serviceClient = ServiceClient.CreateFromConnectionString(configurationService.serviceClientConnectionString);
            logger.LogInformation("DirectMethodService setup complete");
        }
        public async Task CallDirectMethodAsync(string deviceId, string methodName, string payload, bool awaitAction = false)
        {
            var methodInvocation = new CloudToDeviceMethod(methodName)
            {
                ResponseTimeout = TimeSpan.FromSeconds(30)
            };
            //json from string payload

            methodInvocation.SetPayloadJson(payload);

            if (awaitAction)
                await serviceClient.InvokeDeviceMethodAsync(deviceId, methodInvocation);
            else
                _ = serviceClient.InvokeDeviceMethodAsync(deviceId, methodInvocation);

            logger.LogInformation($"Direct method {methodName} called on device {deviceId}");
        }
        public async Task TurnOffFan()
        {
            if (fanRunning)
            {
                string payload = JsonConvert.SerializeObject(new { value = "False" });
                await CallDirectMethodAsync(configurationService.deviceId, "fan", payload);
                fanRunning = false;
            }
        }

        public async Task TurnOnFan()
        {
            if (!fanRunning)
            {
                string payload = JsonConvert.SerializeObject(new { value = "True" });
                await CallDirectMethodAsync(configurationService.deviceId, "fan", payload);
                fanRunning = true;
            }
        }

        public async Task OpenWindow()
        {
            if (!win_open)
            {
                string payload = JsonConvert.SerializeObject(new { value = "True" });
                await CallDirectMethodAsync(configurationService.deviceId, "windows", payload, awaitAction: true);
                win_open = true;
            }
        }

        public async Task CloseWindow()
        {
            if (win_open)
            {
                string payload = JsonConvert.SerializeObject(new { value = "False" });
                await CallDirectMethodAsync(configurationService.deviceId, "windows", payload, awaitAction: true);
                win_open = false;
            }
        }
    }
}
