import{JoyConLeft,JoyConRight}from"./joycon.js";const connectedJoyCons=new Map;navigator.hid.addEventListener("connect",(async({device})=>{console.log(`HID connected: ${device.productName}`);connectedJoyCons.set(device.productId,await connectDevice(device))}));navigator.hid.addEventListener("disconnect",(({device})=>{console.log(`HID disconnected: ${device.productName}`);connectedJoyCons.delete(device.productId)}));document.addEventListener("DOMContentLoaded",(async()=>{const devices=await navigator.hid.getDevices();devices.forEach((async device=>{connectedJoyCons.set(device.productId,await connectDevice(device))}))}));const connectJoyCon=async()=>{const filters=[{vendorId:1406,productId:8198},{vendorId:1406,productId:8199}];try{const[device]=await navigator.hid.requestDevice({filters});if(!device){return}connectedJoyCons.set(device.productId,await connectDevice(device))}catch(error){console.error(error.name,error.message)}};const connectDevice=async device=>{let joyCon;if(device.productId===8198){joyCon=new JoyConLeft(device)}else if(device.productId===8199){joyCon=new JoyConRight(device)}await joyCon.open();await joyCon.enableStandardFullMode();await joyCon.enableIMUMode();return joyCon};export{connectJoyCon,connectedJoyCons,JoyConLeft,JoyConRight};