using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using Microsoft.Azure.Devices;

namespace raspberryFunctionApp
{
    public interface ISensorData
    {
        int temperature { get; set; }
        int humidity { get; set; }
        int airQuality { get; set; }
    }
    public class SensorData : ISensorData
    {
        public int temperature { get; set; }
        public int humidity { get; set; }
        public int airQuality { get; set; }
    }

    public static class IoTHubMethodCaller
    {
        private static ServiceClient serviceClient;

        static IoTHubMethodCaller()
        {
            var connectionString = "HostName=IOTHubBusCrisan.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=pJjNiHObob45NWJGvdamgNCbCGmMovU7kAIoTArU/24=";
            serviceClient = ServiceClient.CreateFromConnectionString(connectionString);
        }

        public static async Task CallDirectMethodAsync(string deviceId, string methodName, string payload)
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
    public static class Function1
    {
        [FunctionName("Function1")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequestMessage req,
            ILogger log)
        {
            var jsonContent = JsonConvert.DeserializeObject<SensorData>(await req.Content.ReadAsStringAsync());
            log.LogInformation("C# HTTP trigger function processed a request.");

            var temperature = jsonContent.temperature;
            var humidity = jsonContent.humidity;
            var airQuality = jsonContent.airQuality;
            await Console.Out.WriteLineAsync(airQuality.ToString());

            if (temperature > 30)
            {
                log.LogInformation("Temperature is too high");
                IoTHubMethodCaller.CallDirectMethodAsync("rasbperry", "high_temperature", "{\"fanState\": \"on\"}").Wait();
            }

            if(humidity > 70)
            {
                log.LogInformation("Humidity is too high");
                IoTHubMethodCaller.CallDirectMethodAsync("rasbperry", "high_humidity", "{\"fanState\": \"on\"}").Wait();
            }

            if(airQuality > 100)
            {
                log.LogInformation("Air Quality is too high");
                IoTHubMethodCaller.CallDirectMethodAsync("rasbperry", "high_airQuality", "{\"fanState\": \"on\"}").Wait();
            }

            var responseMessage = "Succeded";
            return new OkObjectResult(responseMessage);
        }
    }
}
