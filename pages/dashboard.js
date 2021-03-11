import React, { useState, useEffect } from "react";
import Router from "next/router";
import Head from "next/head";
import axios from "axios"
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


import Styles from "../styles/dashboardAdmin.module.css"

import GetAppIcon from '@material-ui/icons/GetApp';
import StorageIcon from '@material-ui/icons/Storage';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';


import { useFetchUser } from "../utils/user";
import { ResponsiveDrawer, Spinner, CustomizedTables } from "../components";
import dataJson from "../backEnd/data4.json";

import { useStyles, getModalStyle } from "../utils/dashboardAdmin/utils"

import { database, storageRef } from "../firebase/firebase";

import { deleteDocFromUserFiles, rightUrl } from "../utils/methods/functions"








export default function Dashboard() {


  const { user, loading } = useFetchUser();
  const [dataset, setDataset] = useState([]);

  // custom hooks to handle  files 
  const [files, setFiles] = useState([{ title: "...", url: "...", size: "..." }]);
  const [filenames, setFilenames] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [message, setMessage] = useState(null)


  const [refresh, setRefresh] = useState(0);

  const [anotherRef, setAnotherRef] = useState(1)


  // material-ui hook
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);















  useEffect(() => {
    if (!user)

      setAnotherRef(anotherRef + 1)
    else {
      axios.get(rightUrl(`userFiles/${user.name}`))
        .then(res => {
          console.log("::req ", res.data)
          setFilenames(res.data)
          console.log("after ::req", filenames, res.data)
          setFiles([]);
          if (process.browser)
            storageRef.listAll().
              then(result => {
                console.log(filenames)
                console.log("::inside browser", res.data)
                console.log("::work", result.items.filter(item => filenames.includes(item.name)).length)



                // only process those intersecting with files users have in dataset_user
                result.items.filter(item => res.data.includes(item.name)).forEach(fileRef => {

                  console.log("::work")
                  fileRef
                    .getDownloadURL()
                    .then((url) => {
                      // `url` is the download URL for your file
                      fileRef.getMetadata().then(metad => {


                        // only add the new file 

                        // those two  approach do the same thing exactly,
                        // setFiles(files => files.concat(({ url: url, title: fileRef.name, size: metad.size / 1000 })))
                        setFiles(files => [...files, { url: url, title: fileRef.name, size: metad.size / 1000, uploadTime: metad.timeCreated.replace("T", " ").substring(0, 16) }])
                      }

                      ).catch(e => console.error({ e }))



                    })
                    .catch((error) => {
                      // Handle any errors
                      console.log(error);

                    });

                })


              }).catch(function (error) {
                // Handle any errors
              });

        })
    }


  }, [refresh, anotherRef])




  if (loading) {
    useEffect(() => {
      console.log(":: loading just for hooks equality seek hh")
    }, [])
    return <Spinner />;
  }

  if (!user) {

    useEffect(() => {
      console.log("::noUser just for hooks equality seek hh")
    }, [])
    Router.push("/");
    return null;
  }





  if (user) {

    useEffect(() => {


      console.log(":user just for the seek of hooks equality")



      // // get all file names from filesName db
      // axios.get(`http://localhost:3000/api/admin/userFiles/amin@gmail.com`)
      //   .then(res => {
      //     setFilenames(res.data)
      //     setFiles([]);
      //   }


      //   ).catch(e => console.error(e))


      // // get all user files
      // if (process.browser)
      //   storageRef.listAll().then(async result => {



      //     //  empty the files array [1 ,2 ] => [] to add new staff

      //     // only process those intersecting with files users have in dataset_user
      //     result.items.filter(item => filenames.includes(item.name)).forEach(async fileRef => {


      //       fileRef
      //         .getDownloadURL()
      //         .then((url) => {
      //           // `url` is the download URL for your file
      //           fileRef.getMetadata().then(metad => {


      //             // only add the new file 

      //             // those two  approach do the same thing exactly,
      //             // setFiles(files => files.concat(({ url: url, title: fileRef.name, size: metad.size / 1000 })))
      //             setFiles(files => [...files, { url: url, title: fileRef.name, size: metad.size / 1000, uploadTime: metad.timeCreated.replace("T", " ").substring(0, 16) }])
      //           }

      //           ).catch(e => console.error({ e }))



      //         })
      //         .catch((error) => {
      //           // Handle any errors
      //           console.log(error);

      //         });

      //     })


      //   }).catch(function (error) {
      //     // Handle any errors
      //   });


    }, [refresh]);





    // palced here so we don't have unbalance rerendering hook count 




    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <ResponsiveDrawer user={user}>


          {/* <Button id="btn" variant="outlined" style={{ marginTop: "20px" }} onClick={() => { setFiles([]); setRefresh(refresh + 1) }} >Refresh</Button> */}





          {message}
          {/* <div style={{ marginTop: "2rem" }}>

          <CustomizedTables data={files} />
       
        </div> */}



          <div style={{ paddingBlock: "20px" }}>
            <p style={{ backgroundColor: "#7545FF", color: "white", padding: "7px", margin: "10px", display: "flex", alignItems: "center ", fontSize: "22px", borderRadius: "8px" }}><StorageIcon /> List of  Datasets </p>

            <div style={{ display: "flex", alignItems: "center ", justifyContent: "space-between", padding: "10px ", color: "gray", marginBottom: "16px", borderBottom: "0.8px #7F00FD solid" }}>
              <p style={{ width: "25%",  color: "black"  , fontSize: "19px", fontWeight: "bold"}}>Datasets</p>

              <p style={{   color: "black"  , fontSize: "19px", fontWeight: "bold"}}>Size KB</p>
              <p style={{  color: "black"  , fontSize: "19px", fontWeight: "bold"}}>Upload Time  </p>


              <p style={{   color: "black"  , fontSize: "19px", fontWeight: "bold"}}>Operation</p>

            </div>
            {files.map(file =>
              <div key={file.uploadTime} style={{ display: "flex", alignItems: "center ", justifyContent: "space-between", marginBottom: "8px", borderBottom: "0.5px #F3F4F6 solid" }}>

                <p style={{ padding: "10px ", fontSize: "18px", fontWeight: "400", color: "#374151", width: "25%", wordWrap: "break-word" }}>
                  {file.title}
                </p>






                <p style={{ marginLeft: "15px" , fontSize: "18px"}}> {file.size}</p>
                <p style={{fontSize: "18px"}}> {file.uploadTime}</p>
                <div>
                  <a href={file.url} style={{ marginTop: "10px", marginRight: "20px", fontSize: "18px" }} ><GetAppIcon className={Styles.downloadIcon} /></a>
                  <DeleteOutlineIcon className={Styles.deleteIcon} onClick={() => { setModalTitle(file.title); setOpenModal(true); }} />

                </div>
                <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                >
                  <div style={modalStyle} className={classes.paper}>

                    <h2 id="simple-modal-title">Are You sure to delete :</h2>
                    <p id="simple-modal-description" style={{ padding: "20px" }}>
                      {modalTitle}?
                                    </p>

                    <div>
                      <Button varient="outlined" style={{ color: "red" }} onClick={() => { setOpenModal(false); deleteDocFromUserFiles({ filename: modalTitle, email: user.name }, setMessage, setRefresh) }} >Yes </Button>
                      <Button varient="contained" color="secondary" onClick={() => setOpenModal(false)} >No </Button>
                    </div>
                  </div>

                </Modal>

              </div>)
            }



          </div>


          <div style={{ marginTop: "100px", fontWeight: "600", textAlign: "center", fontSize: "20px" }}>
            {files.length ? null : ""}
          </div>
          {/* <div>

          {files.map(file =>
            <div style={{ display: "flex", alignItems: "center ", justifyContent: "space-between" }}>
              <p style={{ padding: "10px ", fontSize: "13px" }}>
                {file.title}
              </p>
              <div style={{ display: "flex", alignItems: "center ", justifyContent: "space-between" }}>
                <a href={file.url} style={{ color: "blue", paddingLeft: "10px" }} >download</a>
              </div>
            </div>)
          }
        </div> */}
        </ResponsiveDrawer>
      </>
    );
  }
}


