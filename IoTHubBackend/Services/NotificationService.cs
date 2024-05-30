using Newtonsoft.Json;
using System.Text;

namespace IoTHubBackend.Services
{
    public interface INotificationService
    {
        Task SendNotification(string title, string message);
    }

    public class NotificationService : INotificationService
    {
        private IConfigurationService configurationService;
        private readonly ILogger<NotificationService> logger;

        public NotificationService(
            IConfigurationService configurationService,
            ILogger<NotificationService> logger)
        {
            this.configurationService = configurationService;
            this.logger = logger;
        }

        public async Task SendNotification(string title, string message)
        {
            try
            {
                var body = new
                {
                    to = configurationService.expoToken,
                    sound = "default",
                    title = $"{title}",
                    body = $"{message}",
                    data = new { someData = "goes here" },
                };

                var jsonBody = JsonConvert.SerializeObject(body);

                var client = new HttpClient();
                client.DefaultRequestHeaders.Add("Accept", "application/json");
                client.DefaultRequestHeaders.Add("Accept-Encoding", "gzip, deflate");

                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                await client.PostAsync("https://exp.host/--/api/v2/push/send", content);
            }
            catch (Exception ex)
            {
                logger.LogError($"ERROR in {nameof(SendNotification)}: {ex.Message}");
            }
        }
    }
}
