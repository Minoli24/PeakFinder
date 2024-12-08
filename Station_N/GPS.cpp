#include "Config.h"

// Function to initialize the GPS module
void setupGPS() {
    gpsSerial.begin(GPS_BAUD);
    Serial.println("GPS Module Initialized");
}
