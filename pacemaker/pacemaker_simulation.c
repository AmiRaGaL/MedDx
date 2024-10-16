#include <WiFi.h>
#include <HTTPClient.h>
#include <stdio.h>
#include <stdbool.h>
#include <stdint.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>

#define PACING_INTERVAL 1000                      // Time interval between paces in milliseconds
#define SENSING_THRESHOLD 1.5                     // Threshold for detecting heart signal in mV
#define REFRACTORY_PERIOD 250                     // Time in ms where pacing is disabled to prevent over-pacing
#define NOISE_THRESHOLD 0.05                      // Threshold for filtering out small noise fluctuations
#define SIGNAL_HISTORY_SIZE 5                     // Number of previous signal values to consider for noise filtering
#define WIFI_SSID "YourWiFiSSID"                  // Your WiFi network SSID
#define WIFI_PASSWORD "YourPassword"              // Your WiFi network password
#define SERVER_URL "http://yourserver.com/upload" // External server URL for data transmission

// WiFi Client
WiFiClient client;
HTTPClient http;

// Variables to keep track of timing and signal processing
uint32_t last_paced_time = 0;
bool refractory_period = false;
float signal_history[SIGNAL_HISTORY_SIZE] = {0.0}; // Store previous signal values for smoothing

// Function to simulate a more realistic heart's electrical signal sensing
float sense_heart_signal()
{
    // Simulating fluctuating signal with some noise
    float base_signal = 1.8f + 0.3f * sin((float)(rand() % 360)); // Simulating heart signal variation (sinusoidal-like)
    float noise = ((float)(rand() % 100) / 1000) - 0.05f;         // Small random noise between -0.05 and 0.05 mV
    return base_signal + noise;                                   // Simulated heart signal with noise
}

// Function to smooth heart signal using a simple moving average filter
float smooth_heart_signal(float new_signal)
{
    // Shift history to make room for new signal
    for (int i = SIGNAL_HISTORY_SIZE - 1; i > 0; --i)
    {
        signal_history[i] = signal_history[i - 1];
    }
    signal_history[0] = new_signal; // Add new signal to the history

    // Calculate moving average
    float smoothed_signal = 0.0f;
    for (int i = 0; i < SIGNAL_HISTORY_SIZE; ++i)
    {
        smoothed_signal += signal_history[i];
    }
    return smoothed_signal / SIGNAL_HISTORY_SIZE;
}

// Function to detect sudden abnormalities in heart signal
bool detect_abnormal_signal(float signal)
{
    // Check if the signal has deviated significantly from the threshold
    if (fabs(signal - SENSING_THRESHOLD) > NOISE_THRESHOLD)
    {
        return true; // Considered abnormal if the deviation is significant
    }
    return false;
}

// Function to pace the heart (send an electrical impulse)
void pace_heart()
{
    printf("Pacing the heart...\n");
    last_paced_time = millis(); // Track the time the pacing event occurred
    refractory_period = true;   // Enter refractory period to avoid rapid pacing
}

// Function to connect to WiFi
void connect_to_wifi()
{
    printf("Connecting to WiFi...\n");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        printf("Connecting to WiFi...\n");
    }
    printf("Connected to WiFi\n");
}

// Function to transmit data to an external server
void transmit_data(float heart_signal)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        http.begin(client, SERVER_URL);
        http.addHeader("Content-Type", "application/json");

        // Create JSON payload
        char json_payload[128];
        snprintf(json_payload, sizeof(json_payload),
                 "{\"timestamp\": %lu, \"heart_signal\": %.3f}",
                 millis(), heart_signal);

        // Send the HTTP POST request
        int httpResponseCode = http.POST(json_payload);
        if (httpResponseCode > 0)
        {
            printf("Data transmitted successfully: %s\n", json_payload);
        }
        else
        {
            printf("Error in data transmission: %d\n", httpResponseCode);
        }
        http.end();
    }
    else
    {
        printf("WiFi not connected, unable to transmit data\n");
    }
}

// Main function to monitor and manage pacing, and transmit data
void pacemaker_loop()
{
    uint32_t current_time = millis(); // Get the current time

    // Sense the heart's electrical activity and smooth the signal
    float raw_heart_signal = sense_heart_signal();
    float smoothed_signal = smooth_heart_signal(raw_heart_signal);

    // Transmit the heart signal data to an external server
    transmit_data(smoothed_signal);

    // Check if we are in the refractory period and exit it if the period has passed
    if (refractory_period && (current_time - last_paced_time >= REFRACTORY_PERIOD))
    {
        refractory_period = false; // Exit refractory period after the defined time
    }

    // If the heart's signal is below the threshold and we are not in the refractory period, trigger pacing
    if (smoothed_signal < SENSING_THRESHOLD && !refractory_period)
    {
        // If the time since the last pace is greater than the pacing interval, we should pace the heart
        if (current_time - last_paced_time >= PACING_INTERVAL)
        {
            pace_heart();
        }
    }
    else if (detect_abnormal_signal(smoothed_signal))
    {
        // Detect sudden changes or abnormal heart signal activity
        printf("Warning: Abnormal heart signal detected: %.3f mV\n", smoothed_signal);
    }
    else
    {
        // Heart is beating normally, no pacing needed
        printf("Normal heart signal detected: %.3f mV\n", smoothed_signal);
    }
}

// Simple mock function to simulate millis (real-time in milliseconds) - in real code, this would come from an actual clock/timer
uint32_t millis()
{
    static uint32_t ms = 0;
    ms += 100; // Increment simulated time by 100 ms each call (for simplicity)
    return ms;
}

// Entry point for simulation
int main()
{
    srand(time(NULL)); // Seed for random number generation
    connect_to_wifi(); // Connect to WiFi before starting pacemaker loop

    while (1)
    {
        pacemaker_loop(); // Continuously monitor heart signal and manage pacing
        usleep(100000);   // 100 ms delay to simulate a realistic cycle
    }

    return 0;
}