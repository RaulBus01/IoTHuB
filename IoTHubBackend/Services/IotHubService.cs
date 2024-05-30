using Azure.Messaging.EventHubs.Consumer;
using Azure.Messaging.ServiceBus;
using IoTHubBackend.Services;
using System.Text;

namespace IoTHubBackend
{
    public interface IIotHubService
    {
        public Task Setup();
    }
    public class IotHubService : BackgroundService, IIotHubService
    {
        private EventHubConsumerClient consumer = null;
        private IStorageService storageService;
        private readonly INotificationService notificationService;
        private readonly IDirectMethodService methodService;
        private readonly IConfigurationService configurationService;
        private readonly ILogger<IotHubService> logger;
        private ServiceBusClient serviceBusClient;
        private ServiceBusSender sender;
        private long gasLastSendTime = 0;
        private long tvocLastSendTime = 0;
        private long co2LastSendTime = 0;
        private long tempLastSendTime = 0;
        private long humLastSendTime = 0;

        private long gasAvg = 0, tvocAvg = 0, co2Avg = 0, tempAvg = 0, humAvg = 0;
        private int averageCount = 10;
        public IotHubService(IStorageService storageService, INotificationService notificationService, IDirectMethodService methodService, IConfigurationService configurationService, ILogger<IotHubService> logger)
        {
            this.storageService = storageService;
            this.notificationService = notificationService;
            this.methodService = methodService;
            this.configurationService = configurationService;
            this.logger = logger;
        }

        public async Task Start()
        {
            if (consumer == null)
            {
                await Setup();
            }
            var tasks = new List<Task>();
            var partitions = await consumer.GetPartitionIdsAsync();
            foreach (string partition in partitions)
            {
                tasks.Add(ReceiveMessagesFromDeviceAsync(partition));
            }
        }

        public async Task Setup()
        {
            try
            {
                await storageService.Setup();
                methodService.Setup();
                serviceBusClient = new ServiceBusClient(configurationService.serviceBusConnectionString);
                sender = serviceBusClient.CreateSender(configurationService.queueName);
                consumer = new EventHubConsumerClient(configurationService.consumerGroup, configurationService.eventHubCompatibleEndpoint);
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(Setup)}: {e.Message}", e);
                throw;
            }
        }

        private async Task ReceiveMessagesFromDeviceAsync(string partitionId)
        {
            Console.WriteLine($"Starting listener thread for partition: {partitionId}");
            try
            {
                while (true)
                {
                    await foreach (PartitionEvent receivedEvent in consumer.ReadEventsFromPartitionAsync(partitionId, EventPosition.Latest))
                    {
                        string msgSource;
                        string body = Encoding.UTF8.GetString(receivedEvent.Data.Body.ToArray());
                        if (receivedEvent.Data.SystemProperties.ContainsKey("iothub-message-source"))
                        {
                            msgSource = receivedEvent.Data.SystemProperties["iothub-message-source"].ToString();
                            Console.WriteLine($"{partitionId} {msgSource} {body}");

                            await ProcessEvent(body);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(ReceiveMessagesFromDeviceAsync)}: {e.Message}", e);
                throw;
            }
        }
        public async Task ProcessEvent(string message)
        {
            try
            {
                var parsedValues = Newtonsoft.Json.JsonConvert.DeserializeObject<Dictionary<string, double>>(message);
                var reading = new SensorReadings(parsedValues["gas"], parsedValues["co2"], parsedValues["tvoc"], parsedValues["hum"], parsedValues["temp"], parsedValues["timestamp"]);
                if (reading.Co2 > configurationService.co2Threshold)
                {
                    logger.LogInformation($"CO2 Alert: {reading.Co2}");
                    await storageService.StoreAlert(new Alert("CO2", reading.Co2, reading.Timestamp));

                    var currentTime = DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond;

                    if (currentTime - co2LastSendTime > 60000) //1 minute
                    {
                        logger.LogInformation("Sending gas alert to service bus");
                        await notificationService.SendNotification("CO2 Alert", $"CO2 Value: {reading.Co2}");
                        co2LastSendTime = currentTime;
                    }

                }
                var allert = false;

                if (reading.Gas > configurationService.gasThreshold)
                {
                    logger.LogInformation($"Gas Alert: {reading.Gas}");
                    await storageService.StoreAlert(new Alert("Gas", reading.Gas, reading.Timestamp));

                    await methodService.TurnOnFan();
                    await methodService.OpenWindow();
                    var currentTime = DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond;

                    if (currentTime - gasLastSendTime > 60000) //1 minute
                    {
                        logger.LogInformation("Sending gas alert to service bus");
                        await notificationService.SendNotification("Gas Alert", $"Gas Value: {reading.Gas}");
                        gasLastSendTime = currentTime;
                    }
                    allert = true;
                }

                if (reading.Tvoc > configurationService.tvocThreshold)
                {
                    logger.LogInformation($"TVOC Alert: {reading.Tvoc}");
                    await storageService.StoreAlert(new Alert("TVOC", reading.Tvoc, reading.Timestamp));

                    var currentTime = DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond;

                    if (currentTime - tvocLastSendTime > 60000) //1 minute
                    {
                        logger.LogInformation("Sending tvoc alert to service bus");
                        await notificationService.SendNotification("TVOC Alert", $"TVOC Value: {reading.Tvoc}");
                        tvocLastSendTime = currentTime;
                    }
                }

                if (reading.Temperature > configurationService.tempThreshold)
                {
                    logger.LogInformation($"Temp Alert: {reading.Temperature}");

                    await storageService.StoreAlert(new Alert("Temp", reading.Temperature, reading.Timestamp));

                    await methodService.TurnOnFan();
                    var currentTime = DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond;

                    if (currentTime - tempLastSendTime > 60000) //1 minute
                    {
                        logger.LogInformation("Sending Temperature alert to service bus");
                        await notificationService.SendNotification("Temperature Alert", $"Temperature Value: {reading.Temperature}");
                        tempLastSendTime = currentTime;
                    }
                    allert = true;
                }

                if (reading.Humidity > configurationService.humThreshold)
                {
                    logger.LogInformation($"Hum Alert: {reading.Humidity}");
                    await storageService.StoreAlert(new Alert("Hum", reading.Humidity, reading.Timestamp));

                    var currentTime = DateTime.UtcNow.Ticks / TimeSpan.TicksPerMillisecond;

                    if (currentTime - humLastSendTime > 60000) //1 minute
                    {
                        logger.LogInformation("Sending humidity alert to service bus");
                        await notificationService.SendNotification("Humidity Alert", $"Humidity Value: {reading.Humidity}");
                        humLastSendTime = currentTime;
                    }
                }

                if(averageCount < 10)
                {
                    tvocAvg += (int)reading.Tvoc;
                    gasAvg += (int)reading.Gas;
                    co2Avg += (int)reading.Co2;
                    tempAvg += (int)reading.Temperature;
                    humAvg += (int)reading.Humidity;
                    averageCount++;
                }
                else
                {
                    tvocAvg /= 10;
                    gasAvg /= 10;
                    co2Avg /= 10;
                    tempAvg /= 10;
                    humAvg /= 10;

                    var avgReading = new SensorReadings(gasAvg, co2Avg, tvocAvg, humAvg, tempAvg, reading.Timestamp);
                    await storageService.StoreReadings(avgReading);

                    tvocAvg = 0;
                    gasAvg = 0;
                    co2Avg = 0;
                    tempAvg = 0;
                    humAvg = 0;
                    averageCount = 0;
                }

                ServiceBusMessage msg = new ServiceBusMessage(Encoding.UTF8.GetBytes(message));
                logger.LogInformation($"Sending message to service bus {msg}");
                await sender.SendMessageAsync(msg);

                if (!allert)
                {
                    await methodService.TurnOffFan();
                    await methodService.CloseWindow();
                }
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(ProcessEvent)}: {e.Message}", e);
                throw;
            }
        }

        protected async override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            configurationService.GetFileConfig();
            while (!configurationService.gotConfig)
            {
                await Task.Delay(1000);
            }
            await Start();
        }
    }
}
