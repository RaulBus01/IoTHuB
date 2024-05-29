using Azure.Messaging.ServiceBus;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Logging;
using System.ComponentModel;


namespace IoTHubBackend.Services
{
    public interface IStorageService
    {
        public Task BatchReadings(SensorReadings sensorReadings);
        public Task Setup();
        public Task StoreAlert(Alert alert);
        public Task StoreReadings(SensorReadings sensorReadings);
    }
    public class StorageService : IStorageService
    {
        PartitionKey partitionKey = new PartitionKey("sensorreadings");

        TransactionalBatch batch = null;
        CosmosClient cosmosClient = null;
        Database database = null;
        Microsoft.Azure.Cosmos.Container container = null;

        private const int maxBatchSize = 99;
        private int batchedItems = 0;
        private const double timeInterval = 5000;

        private readonly PeriodicTimer timer = new(TimeSpan.FromMilliseconds(timeInterval));
        private readonly IConfigurationService configurationService;
        private readonly ILogger<StorageService> logger;

        public StorageService(IConfigurationService configurationService, ILogger<StorageService> logger)
        {
            this.configurationService = configurationService;
            this.logger = logger;
        }

        public async Task Setup()
        {
            try
            {
                cosmosClient = new CosmosClient(configurationService.dbConnectionString);
                database = cosmosClient.GetDatabase(configurationService.dbName);
                container = database.GetContainer(configurationService.dbContainerName);
                batch = container.CreateTransactionalBatch(partitionKey);
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(Setup)}: {e.Message}", e);
                throw;
            }
        }

        public async Task BatchReadings(SensorReadings sensorReadings)
        {
            try
            {
                while (await timer.WaitForNextTickAsync() || batchedItems < maxBatchSize - 1)
                {
                    batch.CreateItem(sensorReadings);
                    batchedItems++;
                    if (batchedItems >= maxBatchSize)
                    {
                        await batch.ExecuteAsync();
                        batchedItems = 0;
                        batch = container.CreateTransactionalBatch(partitionKey);
                    }
                }
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(BatchReadings)}: {e.Message}", e);
            }
        }

        public async Task StoreReadings(SensorReadings sensorReadings)
        {
            try
            {
                await container.CreateItemAsync(sensorReadings);
            }
            catch(Exception e)
            {
                logger.LogError($"ERROR in {nameof(StoreReadings)}: {e.Message}", e);
            }
        }

        public async Task StoreAlert(Alert alert)
        {
            try
            {
                await container.CreateItemAsync(alert);
            }
            catch (Exception e)
            {
                logger.LogError($"ERROR in {nameof(StoreAlert)}: {e.Message}", e);
            }
        }
    }
}
