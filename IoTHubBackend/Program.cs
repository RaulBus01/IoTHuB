
using IoTHubBackend;
using IoTHubBackend.Services;
using Microsoft.Extensions.DependencyInjection;

internal class Program
{
    private static void Main(string[] args)
    {
        try
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddHostedService<IotHubService>();
            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddSingleton<IConfigurationService, ConfigurationService>();
            builder.Services.AddTransient<IDirectMethodService, DirectMethodService>();
            builder.Services.AddTransient<IStorageService, StorageService>();
            builder.Services.AddTransient<INotificationService, NotificationService>();


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors();
            app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
        catch (Exception e)
        {
            Console.WriteLine($"ERROR: {e.Message}");
        }
    }
}