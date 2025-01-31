// import { TableCell, TableRow } from "@fluentui/react-components";
// import { Input } from "@fluentui/react-components";
// // import { Switch } from "@fluentui/react-components";
// import { useState } from "react";

// type SettingsProps = {
//     url: string,
//     // screenshot: boolean
// };

// // export const SettingsOptions = ({ url }: SettingsProps) => {
// // export const SettingsOptions = (url: string) => {
// // export const SettingsOptions = (url:string) => {
// export const SettingsOptions = ({ url }: SettingsProps) => {
// // export const SettingsOptions = (SettingsProps: SettingsProps) => {

//     const [tempurl, setTempurl] = useState<string>(url);

//     interface InputOnChangeData {
//         value: string;
//     }

//     const updateTempUrl = (e: React.ChangeEvent<HTMLInputElement>, tempurl: InputOnChangeData) => {
//         setTempurl(tempurl.value);
//         // window.ContextBridge.tempUrlChanged(tempurl.value);
//     };

//     window.ContextBridge.updateUrl((data:string) => {
//         setTempurl(data);
//     });

//     return (
//         <div style={{height: "100%"}}>
//             <TableRow style={{borderBlockColor: "transparent", backgroundColor: "transparent"}}>
//                 <TableCell style={{height:20}}>
//                 </TableCell>
//                 <TableCell style={{height:20}}>
//                 </TableCell>
//             </TableRow>
//             <TableRow style={{borderBlockColor: "transparent", marginBottom: 20, backgroundColor: "transparent"}}>
//                 <TableCell>
//                     OpenAI API Endpoint
//                 </TableCell>
//                 <TableCell style={{right:"0%"}}>
//                     <div style={{ display: "flex", flexDirection: "row-reverse" }}>
//                         <Input
//                             autoFocus
//                             // width={"100%"}
//                             size="large"
//                             placeholder=""
//                             appearance="filled-darker"
//                             // appearance="underline"
//                             // style={{borderRadius: 50}}
//                             onChange={updateTempUrl}
//                             value={tempurl}
//                         />
//                     </div>
//                 </TableCell>
//             </TableRow>
//             {/*
//             <TableRow style={{borderBlockColor: "transparent", width:"100%", backgroundColor: "transparent"}}>
//                 <TableCell>
//                     Toggle One
//                 </TableCell>
//                 <TableCell style={{right:"0%", width:"100%"}}>
//                     <div style={{ display: "flex", flexDirection: "row-reverse" }}>
//                         <Switch checked={one}></Switch>
//                     </div>
//                 </TableCell>
//             </TableRow>
//             */}
//         </div>
//     );
// };
