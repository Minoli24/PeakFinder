#include "Config.h"

TinyGPSPlus gps; // Initialize the GPS module using the TinyGPSPlus library
SoftwareSerial gpsSerial(GPS_RX_PIN, GPS_TX_PIN); // Define a SoftwareSerial object for GPS communication, using the specified RX and TX pins

// Define other global variables here 
// Initialize the OLED display with specified width, height, and I2C configuration
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

// Variables to track emergency state timing
unsigned long emergencyStartTime = 0; // Tracks when an emergency starts
unsigned long emergencyDuration = 0; // Tracks the duration of the emergency

// Define the emergency display state and related timer variables
EmergencyDisplayState emergencyDisplayState = EMERGENCY_DISPLAY_IDLE;
unsigned long emergencyDisplayTimer = 0; // Timer for managing display updates
const unsigned long DISPLAY_SENT_DURATION = 5000; //  Time in miliseconds for displaying sent confirmation (5 seconds)

//Variables to manage LED states and button inputs
bool led1State = false; //State of LED 1
// bool led2State = false; // State of LED 2 (Commented out)
bool lastButton1State = HIGH; // Last recorded state of Button 1 (HIGH indicates not pressed)
// bool lastButton2State = HIGH; // Last recorded state of Button 2 (commented out)
unsigned long led2Timer = 0; // Timer for managing LED 2 operations


// Variables for mesh network communication
painlessMesh mesh; 
Scheduler meshScheduler;
bool EMERGENCY = false; //Flag to indicate if an emergency is active
// bool HELP = false;
uint32_t nodeId; // Unique ID for the mesh node 

// Variable to track battery percentage
int batteryPercentage = 0; // Percentage of battery charge remaining
// Struct to store system status information
SystemStatus systemStatus = {false, false, false, 0, 0, 0, 0.0, 0.0};

//System Status Information 
// false - GPS status (false = not connected)
// false - Mesh network status (false = not connected)
// false - OLED display status (false = not initialized)
// 0 - Number of messages sent
// 0 - Number of messages received
// 0 - Number of emergency messages
// 0.0 - Latitude (GPS coordinate)
// 0.0 - Longitude (GPS coordinate)
