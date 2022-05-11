import { GoMortarBoard } from "react-icons/go";
import { useParams } from "react-router-dom";
import { HiClipboardList } from "react-icons/hi";
import { HiOutlineUpload } from "react-icons/hi";
import { IoLink } from "react-icons/io5";
import fileImg from '../../img/file.png';
import { FaRegCommentDots } from "react-icons/fa";
import { AiOutlineComment } from "react-icons/ai";
import { IoSend} from "react-icons/io5";
import '../../style/style.css';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import { Link } from "react-router-dom";

function UserAssignment() {


    const { idClass } = useParams();
    const {idAs} = useParams();
    const [user, setUser] = useState({});
    const [assignment, setAssignment] = useState({});
    const [attachments, setAttachment] = useState([]);
    const [submissionData, setSubmissionData] = useState([]);
    const [time ,setTime]= useState("");
    const [date ,setDate]= useState("");
    const [privateInput,setPrivIn]= useState("com-input");
    const [privateCom,setPrivCom]= useState("private-coms");
    const [publicInput,setPubIn]= useState("com-input");
    const [publicCom,setPubCom]= useState("public-coms");
    const [selectedFile, setSelectedFile] = useState();
    const [fileName, setSelectedFileName] = useState("");
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [attId, setAttId] = useState();
    const [linkUp,setLinkUp] = useState([]);
    const [fileUp, setFileUp] = useState([]);
    const [link, setLink] = useState("");
    const [linkTab, setLinkTab] = useState('hide');
    const [fileTab, setFileTab] = useState('hide');
    const [listOp, setListOp] = useState('hide');
    const [submission,setSubmission] = useState({});
    let subIds = submission.submission_id;
    
    let FileName = fileName.substring(fileName.lastIndexOf("\\") + 1).split(".")[0];
    //define history
    const history = useHistory();

    //token
    const token = localStorage.getItem("token");

    let urlAs = 'http://localhost:8000/api/classroom/'+idClass+'/assignments/students/'+idAs;
    //function "fetchData"
    const fetchData = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        //fetch user from Rest API
        await axios.get('http://localhost:8000/api/user/')
        .then((response) => {
            setUser(response.data.data);
        })
        await axios.get(urlAs)
        .then((response) => {
            setAssignment(response.data.assignment);
            setAttachment(response.data.assignment_attachments);
            setSubmissionData(response.data.submission_attachments);
            setSubmission(response.data.submission);
            setTime(response.data.assignment.due_time);
            setDate(response.data.assignment.due_date);
        })
    }    
    //hook useEffect
    useEffect(() => {

        //check token empty
        if(!token) {

            //redirect login page
            history.push('/login');
        }
        
        //call function "fetchData"
        fetchData();
    }, []);

    //function logout
    const logoutHandler = async () => {

        //set axios header dengan type Authorization + Bearer token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            //remove token from localStorage
            localStorage.removeItem("token");

            //redirect halaman login
            history.push('/login');
    };

    let photo = user.profile_photo;

    const [profile, setProfile] = useState("profile");
  
    const changeDisplay2 = () => {
     if (profile === "profile")
     {
        setProfile("profile2");}
        else{
            setProfile("profile");  
}
    };

    const changeDisplay3 = () => {
        if (privateCom === "private-coms")
        {
            setPrivCom("com-input");
            setPrivIn("private-input")}
           else{
            setPrivCom("private-coms");
            setPrivIn("com-input");  
   }
       };

       const changeDisplay4 = () => {
        if (publicCom === "public-coms")
        {
            setPubCom("com-input");
            setPubIn("public-input")}
           else{
            setPubCom("public-coms");
            setPubIn("com-input");  
   }
       };

    function changePage(){
history.push('/');
window.location.reload(false);
    }

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
        setSelectedFileName(event.target.files[0].name);
        };
        
        const fileHandler = async (e) => {
            e.preventDefault();
            const formData = new FormData();

            formData.append('file', selectedFile);
            formData.append('submission_id', subIds);
            formData.append('filename', FileName);
            //send data to server
            await axios.post('http://localhost:8000/api/upload/', formData)
            .then((response) => {
                const fileData = response.data.file;
            setFileTab('hide');
            setLinkTab('hide');
            setSelectedFile();
        setIsFilePicked(false);
        setSelectedFileName("");
        window.location.reload(false);
            })
            .catch((error) => {
            })
            };
    
        const linkHandler = async (e) => {
            e.preventDefault();
            (async () => {
            const res = await fetch("http://localhost:8000/api/links/", {
                method: "POST",
                headers: {
                    'Authorization': 'Bearer ' + token,
                "Content-Type": "application/json",
                Origin: "https://127.0.0.1:5000",
                },
    
                body: JSON.stringify({ url: link, submission_id: subIds}),
            });
            const content = await res.json();
            const links = content.link;
            setAttId(links.id);
            setFileTab('hide');
            setLinkTab('hide');
            setLink("");
            window.location.reload(false);
            })();
            };

        const showOp = () => {
            if(listOp === 'hide'){
                setListOp('classOp2 v2');
                setFileTab('hide');
                setLinkTab('hide');
            }else{
                setListOp('hide');
                setFileTab('hide');
                setLinkTab('hide');
            }
        }
            
        const showFile = () => {
            if(fileTab === 'hide'){
                setFileTab('tabs v4');
                setListOp('hide');
                setLinkTab('hide');
            }
        }

        const showLink = () => {
            if(linkTab === 'hide'){
                setListOp('hide');
                setFileTab('hide');
                setLinkTab('tabs v4');
            }
        }

        const hide = () => {
            setFileTab('hide');
            setLinkTab('hide');
            setListOp('hide');
            setSelectedFile();
            setIsFilePicked(false);
            setSelectedFileName("");
            setLink("");
        }

        const dellFile = function(value) {
            return async function(e) {
                e.preventDefault();
                for(let i = 0; i < submissionData.length; i++) {
                    let data = submissionData[i];
                    if ( data.link === null && data.file !== null){
                        console.log("File Ada");
                        
                        console.log(value);
                        if(data.file.file_id === value){
                        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.delete('http://localhost:8000/api/attachments/'+data.attachment.attachment_id)
            .then((response) => {
                window.location.reload(false)
            });
                        }
                    }
                }
            };
          };
        
        const dellLink = function(value) {
            return async function(e) {
                e.preventDefault();
                for(let i = 0; i < submissionData.length; i++) {
                    let data = submissionData[i];
                    if ( data.file === null && data.link !== null){
                        if(data.link.id === value){
                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            axios.delete('http://localhost:8000/api/attachments/'+data.attachment.attachment_id)
            .then((response) => {
                window.location.reload(false)
            });
                        }
                    }
                }
                
            };
          };
    let total = assignment.total_marks;
    let totalMark ="";

    if(total === 100){
        totalMark = "0/100";
    }
    let times = time.split(':');
    let hour = times[0];
    let min = times[1];
    let arr = date.split('-');
    let year = arr[0];
    let month = arr[1];
    let day = arr[2];
    let  months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Des"];
    let monthName=months[parseInt(month)-1];
    let deadline ="Tenggat : "+day+" "+monthName+" "+year+" "+hour+"."+min;

    return (
        <div className="wrapper-all">
        <div className="wrapper">
            <div>
             <nav className="nav fixed-top">
             <GoMortarBoard className='icon'/>
                <h2 onClick={changePage} className="title">Thearning</h2>
                <img src={photo} alt='img' className='prof'onClick={changeDisplay2}/>
                <div className={profile}>
                <table>
                    <tbody>
                    <tr>
                        <td><img src={photo} alt='img'className='prof2'/></td>
                    </tr>
                    <tr>
                        <td className='name'>{user.fullname}</td>
                    </tr>
                    <tr>
                        <td className='email'>{user.status}</td>
                    </tr>
                    <tr>
                        <td>
                        <button onClick={logoutHandler} className="btn btn-md btn-danger">LOGOUT</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                </div>
            </nav>
            </div>
            <div className="container3 v2"> 
            <div className="left-As">
                <HiClipboardList className="logo-As"/>
        <h1>{assignment.assignment_name}</h1>
        <div className="detail-As">
        <p>{totalMark}</p>
        <p>{deadline}</p>
        </div>
        <hr></hr>
        <p>{assignment.instructions}</p>
        <div className="upload-tab v2">
        {attachments.map((attachments) => ( attachments.file === null ? (
            <div className="link-tab">
            <div className="link-info">
            <h6><img src={attachments.link.thumbnail} alt="" style={{width:"50px",height:"auto",marginRight:"10px"}} /></h6>
            <Link to={{ pathname: attachments.link.url }} target="_blank" style={{textDecoration:'none'}}>
            <p>{attachments.link.title}</p>
            </Link>
            </div>
            <p style={{position: "absolute",top: "30px",left: "70px",textOverflow: "ellipsis",width: "100px"}}>{attachments.link.url}</p>
        </div>
        ) : (
            <div className="link-tab">
                <div className="link-info">
                <h6><img src={fileImg} alt="" style={{width:"40px",height:"auto",marginRight:"10px"}} className="file-img" /></h6>
                <p>{attachments.file.filename}</p>
                </div>
                <p style={{position: "absolute",top: "30px",left: "60px",textOverflow: "ellipsis",width: "100px"}}>{attachments.file.filetype}</p>
            </div>
        )))}
            </div>
            <div className="footer">
            <hr></hr>
            <div className="public-com">
            <AiOutlineComment className="public-icon"/>
            <h6>Komentar kelas</h6>
            <div className={publicCom} >
            <p onClick={changeDisplay4}>Tambahkan Komentar Kelas</p>
            </div>
            </div>
            <div className={publicInput}>
            <img src={photo} alt='img'className='prof4'/>
            <textarea className="form-control" placeholder="Masukkan Komentar"></textarea>
            <IoSend className="public-send"/>
            </div>
            </div>
            </div>
            <div className="right-As">
            <div className="submission">
                <h5>Tugas Anda</h5>
                {submissionData.map((attachments) => ( attachments.file === null ? (
            <div className="sub-container v2">
            <div className="link-info">
            <form onSubmit={dellLink(attachments.link.id)}>
                <button type="submit" className="btns v2"></button>
            </form>
            <img src={attachments.link.thumbnail} alt="img" style={{width:"50px",height:"auto",marginRight:"10px"}} />
            <Link to={{ pathname: attachments.link.url }} target="_blank" style={{textDecoration:'none'}}>
            <p>{attachments.link.title}</p>
            </Link>
            </div>
            <p style={{position: "absolute",top: "20px",left: "10px"}} className="url">{attachments.link.url}</p>
            </div>
        ) : (
            <div className="sub-container v2">
                <div className="link-info">
                <form onSubmit={dellFile(attachments.file.file_id)}>
                <button type="submit" className="btns v2"></button>
            </form>
                            <img src={fileImg} alt="img" style={{width:"30px",height:"auto",marginRight:"10px"}} className="file-img" />
                            <p className="file-info">{attachments.file.filename}</p>
                            </div>
                            <p style={{position: "absolute",top: "20px",left: "7px"}} className="file-info">{attachments.file.filetype}</p>
                </div>
        )))}
                <div className="btn-unsubmit">
                <button className="btn btn-outline-primary" style={{marginBottom:'5px'}} onClick={showOp}>Tambah Data</button><br></br>
                <button className="btn btn-primary">Submit</button>
                <div className={listOp}>
                <button onClick={showLink} className="btn-op"><IoLink style={{marginRight:'10px'}}/>Link</button>
                <button onClick={showFile} className="btn-op"><HiOutlineUpload style={{marginRight:'10px'}}/>File</button>
                </div>
                <div className={fileTab}>
                <form onSubmit={fileHandler}>
                <input type="file" className="form-control" onChange={changeHandler} placeholder="Pilih File"/>
                <button className="btn btn-primary" type="submit">Submit</button>
                </form>
                <button className="btn btn-outline-primary" style={{position: 'absolute',bottom: '20px',left: '75px'}} onClick={hide}>Batal</button>
                </div>
                <div className={linkTab}>
                <form onSubmit={linkHandler}>
                <input type="text" className="form-control" value={link} onChange={(e) => setLink(e.target.value)} placeholder="Salin Link Disini"/>
                <button className="btn btn-primary" type="submit" >Submit</button>
                </form>
                <button className="btn btn-outline-primary" style={{position: 'absolute',bottom: '20px',left: '75px'}} onClick={hide}>Batal</button>
                </div>
                </div>
                </div>
            <div className="private-com">
            <FaRegCommentDots className="private-icon"/>
            <h6>Komentar Pribadi</h6>
            <div className={privateCom}>
            <center >
                <p onClick={changeDisplay3}>Tambahkan Komentar Pribadi</p>
            </center>
            </div>
            <div className={privateInput}>
            <img src={photo} alt='img'className='prof3'/>
            <textarea className="form-control" placeholder="Masukkan Komentar"></textarea>
            <IoSend className="private-send"/>
            </div>
            </div>
            </div>
            </div>
        </div>
        </div>
    );
}
export default UserAssignment;
