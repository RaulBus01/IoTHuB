using IoTHubBackend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Devices;

namespace IoTHubBackend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class IotController : ControllerBase
    {
        private readonly ILogger<IotController> logger;
        private readonly IDirectMethodService directMethodService;
        private readonly IConfigurationService configService;

        public IotController(ILogger<IotController> logger, IDirectMethodService iotService, IConfigurationService configService)
        {
            this.logger = logger;
            this.directMethodService = iotService;
            this.configService = configService;
        }

        [HttpPost("SetConfig")]
        public async Task<ActionResult> SetConfig([FromBody] DeviceConfig deviceConfig)
        {
            configService.SetConfig(deviceConfig.serviceClientConnectionString, 
                deviceConfig.serviceBusConnectionString, 
                deviceConfig.queueName, 
                deviceConfig.eventHubCompatibleEndpoint, 
                deviceConfig.eventHubName,
                deviceConfig.dbConnectionString,
                deviceConfig.dbName,
                deviceConfig.dbContainerName,
                deviceConfig.consumerGroup);

            return Ok(deviceConfig);
        }

        [HttpPost("SetCo2Threshold")]
        public ActionResult UpdateCo2Threshold([FromBody] double co2Threshold)
        {
            this.configService.SetCo2Threshold(co2Threshold);
            logger.LogInformation($"CO2 Threshold set to {co2Threshold}");
            return Ok();
        }

        [HttpPost("SetTvocThreshold")]
        public ActionResult UpdateTvocThreshold([FromBody] double tvocThreshold)
        {
            this.configService.SetTvocThreshold(tvocThreshold);
            logger.LogInformation($"TVOC Threshold set to {tvocThreshold}");
            return Ok();
        }

        [HttpPost("SetGasThreshold")]
        public ActionResult UpdateGasThreshold([FromBody] double gasThreshold)
        {
            this.configService.SetGasThreshold(gasThreshold);
            logger.LogInformation($"Gas Threshold set to {gasThreshold}");
            return Ok();
        }

        [HttpPost("SetHumThreshold")]
        public ActionResult UpdateHumThreshold([FromBody] double humThreshold)
        {
            this.configService.SetHumThreshold(humThreshold);
            logger.LogInformation($"Humidity Threshold set to {humThreshold}");
            return Ok();
        }

        [HttpPost("SetTempThreshold")]
        public ActionResult UpdateTempThreshold([FromBody] double tempThreshold)
        {
            this.configService.SetTempThreshold(tempThreshold);
            logger.LogInformation($"Temperature Threshold set to {tempThreshold}");
            return Ok();
        }

        [HttpGet("GetConfig")]
        public ActionResult GetConfig()
        {
            DeviceConfig config = new DeviceConfig
            {
                serviceClientConnectionString = this.configService.serviceClientConnectionString,
                serviceBusConnectionString = this.configService.serviceBusConnectionString,
                queueName = this.configService.queueName,
                eventHubCompatibleEndpoint = this.configService.eventHubCompatibleEndpoint,
                eventHubName = this.configService.eventHubName,
                dbConnectionString = this.configService.dbConnectionString,
                dbName = this.configService.dbName,
                dbContainerName = this.configService.dbContainerName,
                consumerGroup = this.configService.consumerGroup,
                gotConfig = this.configService.gotConfig
            };
            return Ok(config);
        }

        [HttpGet("GetThresholds")]
        public ActionResult GetThresholds()
        {
            var thresholds = new
            {
                co2Threshold = this.configService.co2Threshold,
                tvocThreshold = this.configService.tvocThreshold,
                gasThreshold = this.configService.gasThreshold,
                humThreshold = this.configService.humThreshold,
                tempThreshold = this.configService.tempThreshold
            };
            return Ok(thresholds);
        }

        [HttpPost("SetThresholds")]
        public ActionResult SetThresholds([FromBody] Thresholds thresholds)
        {
            this.configService.SetCo2Threshold(thresholds.co2Threshold);
            this.configService.SetTvocThreshold(thresholds.tvocThreshold);
            this.configService.SetGasThreshold(thresholds.gasThreshold);
            this.configService.SetHumThreshold(thresholds.humThreshold);
            this.configService.SetTempThreshold(thresholds.tempThreshold);
            logger.LogInformation($"Thresholds set to {thresholds.co2Threshold}, {thresholds.tvocThreshold}, {thresholds.gasThreshold}, {thresholds.humThreshold}, {thresholds.tempThreshold}");
            return Ok();
        }
    }

    public class Thresholds
    {
        public double co2Threshold { get; set; }
        public double tvocThreshold { get; set; }
        public double gasThreshold { get; set; }
        public double humThreshold { get; set; }
        public double tempThreshold { get; set; }
    }

    public class MethodCallData
    {
        public string DeviceId { get; set; }
        public string MethodName { get; set; }
        public string Payload { get; set; }
    }
}