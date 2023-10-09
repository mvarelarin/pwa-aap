import {
    Barcode,
    BarcodePicker,
    ScanSettings,
    configure,
    CameraSettings,
    BrowserHelper,
    Logger,
  } from 'scandit-sdk';
import { useEffect, useRef } from 'react';
const licenseKey = "YOUR_SCANDIT_SCANNER_IS_NEEDED_HERE";
  const Scanner = () => {
    const barcodePickerRef = useRef();
    useEffect(() => {
        async function runScanner() {
            if (window && window.navigator && barcodePickerRef.current) {
                // configuration settings defined here
                configure(licenseKey, {
                  engineLocation: 'https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/',
                  highQualityBlurryRecognition: true,
                  loadTextRecognition: false,
                  logLevel: Logger.Level.QUIET,
                })
                  .then(() => {
                    BarcodePicker.create(barcodePickerRef.current, {
                      hideLogo: true,
                      enableCameraSwitcher: false,
                      enablePinchToZoom: true,
                      enableTorchToggle: true,
                      cameraSettings: {
                        resolutionPreference: CameraSettings.ResolutionPreference.FULL_HD,
                      },
                      visible: false,
                    }).then((barcodePicker) => {
                      // optimal scan settings for the types of barcodes we will be handling
                      const scanSettings = new ScanSettings({
                        enabledSymbologies: [
                          Barcode.Symbology.PDF417,
                          Barcode.Symbology.CODE39,
                          Barcode.Symbology.CODE93,
                          Barcode.Symbology.DATA_MATRIX,
                          Barcode.Symbology.QR,
                          Barcode.Symbology.MICRO_QR,
                          Barcode.Symbology.AZTEC,
                          Barcode.Symbology.CODE128,
                        ],
                        codeDuplicateFilter: 1000, // Minimum delay between duplicate results
                        searchArea: { x: 0, y: 0.333, width: 1, height: 0.333 },
                      });
           
                      // apply custom scan settings that are set above
                      barcodePicker.applyScanSettings(scanSettings);
           
                      // when barcode is detected from camera (success case)
                      barcodePicker.on('scan', (scanResult) => {
                        console.log("Scanned code:", scanResult?.barcodes[0]?.data);
                        // Handle detected barcode data
                        // handleBarcodeResult(scanResult?.barcodes[0]?.data);
                        // Pause scan after successful detection for memory usage
                        barcodePicker.pauseScanning(true);
                        // handleDebugData(debugData);
                        // exitCameraPage();
                      });

                      // only display the scanner when it's ready to use
                      barcodePicker.on('ready', () => {
                        barcodePicker.setVisible(true);
                      });
           
                      // when an error occurs during scanning initialization and execution
                      barcodePicker.on('scanError', (error) => {
                        barcodePicker.pauseScanning(true);
                        console.error(error);
                      });
                    });
                  })
                  .catch((error) => {
                    // log error and send to diagnostics backend
                    console.error(error);
                  });
              }
        }
        runScanner().catch((error) => {
            console.error(error);
            alert(error);
        });
    }, []);

    return(
        <>
        <div ref={barcodePickerRef}></div>
      </>
    )
  };
  export default Scanner;