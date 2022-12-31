import React, {useState, useContext} from "react";
import "./style.scss";
import Auth from "../../../context/Auth";
import {
  useCreateStream,
} from "@livepeer/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from '../../../assets/Launch.png'
import axios from "axios";

const CreateStream = () => {

  const [streamName, setStreamName] = useState("");
  const [streamInfo, setStreamInfo] = useState("");
  const navigate = useNavigate()

  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream(streamName ? { name: streamName, record: true } : null);

  const { setVideo, channelData, address } = useContext(Auth);

  const submitForm = async (e) => {

    e.preventDefault();  
    createStream?.();

  };

  useEffect(() => {
    const selfCall = async () => {

      if(channelData === 0) {
        alert('Set channel first !!!')
        navigate('/create-channel')
      }
      if(localStorage.getItem('videoInfo') !== null){
        navigate('/streaming-mode')
      }

      if(stream !== undefined){
        if(stream.streamKey!==undefined){
          let obj = {name: streamName, info: streamInfo, key: stream.streamKey, id: stream.id, plabackId: stream.playbackId, url: stream.playbackUrl};
          
          let baseURL = `${process.env.REACT_APP_BASE_URL}/api/streamer/${address}`;
          const data = await axios.get(baseURL)
          console.log(data.data);
          if (data.data) {      
            baseURL = `${process.env.REACT_APP_BASE_URL}/api/u_streamer`;
            const data = await axios.post(baseURL, {
              walletAddress:address,
              streamName,
              streamInfo,
              playbackId: stream.playbackId,
              isStreaming: true
            })
            console.log(data);
          } else {
            baseURL = `${process.env.REACT_APP_BASE_URL}/api/streamer`;
            const data = await axios.post(baseURL, {
              walletAddress:address,
              streamName,
              streamInfo,
              playbackId: stream.playbackId
            })
            console.log(data);
          }
          localStorage.setItem('videoInfo', JSON.stringify(obj))
          setVideo(obj)
          navigate("/streaming-mode")
        }
      } 
    }
    selfCall()
  })
  

  return (
    <div className="container">
      <img src={bg} alt="" className="fixed w-[500px] ml-[500px]" />
      <form
          className="flex flex-col items-center justify-center"
          onSubmit={submitForm}
        >
          <input
            type="text"
            placeholder="Stream name"
            onChange={(e) => setStreamName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Stream info"
            onChange={(e) => setStreamInfo(e.target.value)}
          />
          <button
            type="submit"
            variant="primary"
            className="w-screen sm:w-48 btn-style"
          >
            Go Live
          </button>
        </form>
    </div>
  );
};

export default CreateStream;
