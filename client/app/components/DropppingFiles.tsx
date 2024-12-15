"use client"
import axios from 'axios';
import React, { useCallback,useState } from 'react'
import { useDropzone } from 'react-dropzone'


const DropppingFiles = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [author, setAuthor] = useState('');

    const onDrop = useCallback(async (files) => {
      // if (!title || !author) {
      //   alert('Title and Author are required fields.');
      //   return;
      // }
        // Do something with the files
        console.log("the state variables are ",title,description,author);
        console.log("the files dropped here is ",files);
        // !ab mereko yeh backend pe bhej na hai and udhar se upload karna hai 
        // !now fact yeh hai ke req mai kese bheju ke usko file mil jaye 
        // const file=files[0];

        const config={
            headers:{
                'Content-Type':'multipart/form-data',
            },
        }

        // const formData=new FormData();
        // formData.append('file',file);

        // console.log("the filedata is ",formData);

        // // !abhi axios ke help se req karo backend ko 
        // const response=await axios.post("http://localhost:8080/upload",formData,config);
        // console.log("the response is ",response);
        // if(response){
        //     console.log("the whole response is",response);
        //     console.log("the response form the upload to s3 bucket backend api in the frontend is ",response.data);
        // }else{

        //     console.log(' ab yeh toh pata hai ke file upload ke dauran error aya hai but yeh nahi pata ke kaha se yeh error milega baki yeh error frontend se hai api response ke bad ')

        // }

        // !trying to upload a file by chunking it 
        try {

            const file=files[0];

            // !figuring out the chunk size 
            // const chunkSize = 1*1024*1024; // 5mb chunks
            // const totalchunks = Math.ceil(file.size/chunkSize);
            // console.log(file.size);
            // console.log(chunkSize);
            // console.log(totalchunks);

            // !logic to chunk from first principles
            // let start=0;

            // for(let chunkIndex=0; chunkIndex<totalchunks;chunkIndex++){
            //     const chunk=file.slice(start,start+chunkSize);
            //     start+=chunkSize;
            //     // !defining the form data
            //     const formData = new FormData();
            //     formData.append('filename', file.name);
            //     formData.append('chunk', chunk);
            //     formData.append('totalChunks', totalchunks.toString());
            //     formData.append('chunkIndex', chunkIndex.toString());


       
            //     console.log('Uploading chunk', chunkIndex + 1, 'of', totalchunks);

            //     const res=await axios.post("http://localhost:8080/upload",formData,config);
            //     console.log("the response is ",res);
            // }


            // !now the task is to do chunking + multipart upload 

            const formData=new FormData();
            formData.append('filename',file.name);


            // !lets go for the first step
            const res=await axios.post("http://localhost:8080/multipartUpload/initialize",formData,config);
            console.log("the response in frontend from the first step of the multipart upload is ",res.data);
            const {uploadId}=res.data;
            console.log("the uploadId is ",uploadId);

            const chunkSize = 50* 1024 * 1024; // 5 MB chunks
            const totalChunks = Math.ceil(file.size / chunkSize);


           

            let start = 0;
            // !for better performance using promise.all
            const UploadPromises=[];

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
       
              const chunk = file.slice(start, start + chunkSize);
              start += chunkSize;
              const chunkFormData = new FormData();
              chunkFormData.append('filename', file.name);
              chunkFormData.append('chunk', chunk);
              chunkFormData.append('totalChunks', totalChunks.toString());
              chunkFormData.append('chunkIndex', chunkIndex.toString());
              chunkFormData.append('uploadId', uploadId);


              
       
              const uploadPromise=axios.post('http://localhost:8080/multipartUpload/upload', chunkFormData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              });
              UploadPromises.push(uploadPromise);
            }

            await Promise.all(UploadPromises);
       
            const completeRes = await axios.post('http://localhost:8080/multipartUpload/complete', {
              filename: file.name,
              totalChunks: totalChunks,
              uploadId: uploadId,
              title: title,
              description: description,
              author: author
       
            });
       
            console.log(completeRes.data);
          
        
     
        } catch (error) {
            console.log("the error was while uploading file from frontend",error);
        }

      }, []);

      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  return (
    <>
    <div className='container mx-auto max-w-lg p-10'>
    <div className="mb-4">
        <input type="text"
               name="title"
               placeholder="Title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               
               className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500" />
      </div>
      <div className="mb-4">
        <input type="text"
               name="description"
               placeholder="Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500" />
      </div>
      <div className="mb-4">
        <input type="text"
               name="author"
               placeholder="Author"
               value={author}
               onChange={(e) =>{console.log(author);setAuthor(e.target.value)} }
               
               className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500" />
      </div>
    <div {...getRootProps()} className="shadow-xl w-full h-[200px] rounded-xl">
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p className='px-3 py-3 mx-auto'>Drop the files here ...</p> :
          <p className='px-3 py-3 mx-auto'>Drag &apos;n&apos; drop some files here, or click to select files</p>
      }
    </div>
    </div>
    </>
  )
}

export default DropppingFiles