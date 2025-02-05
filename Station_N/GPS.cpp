#include "Config.h"

// Function to initialize the GPS module
void setupGPS() {
    gpsSerial.begin(GPS_BAUD); // Start communication with the GPS module at the defined baud rate
    Serial.println("GPS Module Initialized"); // Output a message indicating successful initialization
}
