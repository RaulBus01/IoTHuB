using Microsoft.Azure.Devices;
using Microsoft.Rest;

namespace IoTHubBackend.Services
{
    public interface IDirectMethodService
    {
        public Task CallDirectMethodAsync(string deviceId, string methodName, string payload);
        void Setup();
    }
    public class DirectMethodService : IDirectMethodService
    {
        private readonly IConfigurationService configurationService;
        private ServiceClient serviceClient;

        public DirectMethodService(IConfigurationService configurationService)
        {
            this.configurationService = configurationService;
        }

        public void Setup()
        {
            serviceClient = ServiceClient.CreateFromConnectionString(configurationService.serviceClientConnectionString);
        }
        public async Task CallDirectMethodAsync(string deviceId, string methodName, string payload)
        {
            var methodInvocation = new CloudToDeviceMethod(methodName)
            {
                ResponseTimeout = TimeSpan.FromSeconds(30)
            };

            methodInvocation.SetPayloadJson(payload);

            var response = await serviceClient.InvokeDeviceMethodAsync(deviceId, methodInvocation);

            Console.WriteLine($"Response status: {response.Status}");
            Console.WriteLine($"Response payload: {response.GetPayloadAsJson()}");
        }
    }
}
