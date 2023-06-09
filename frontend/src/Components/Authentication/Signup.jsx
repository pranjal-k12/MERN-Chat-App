import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
  const navigate = useNavigate()
 const [show, setShow] = useState(false)
 const [name, setName] = useState()
 const [email, setEmail] = useState()
 const [confirmPassword, setConfirmPassword] = useState()
 const [password, setPassword] = useState()
 const [pic, setPic] = useState()
 const [picLoading, setPicLoading] = useState(false);
 const toast = useToast();

 const handleClick = () => setShow(!show)

 const postDetails = (pics) => {
    setPicLoading(true);
    if(pics === undefined) {
      toast({
        title: "Please selsect an Image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom"
      })
      return;
    }

    if(pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dlfnm4mzc");
      fetch("https://api.cloudinary.com/v1_1/dlfnm4mzc/image/upload", {
        method: "post",
        body: data,
      })
      .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
 }

 const submitHandler = async () => {
     setPicLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
    const response = await axios.post(
        "http://localhost:4100/api/user",
        {
          name,
          email, 
          password,
          pic,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      console.log(response);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(response));
      setPicLoading(false);
      navigate('/chats')
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    }
 }

  return <VStack spacing={'4px'}>

    <FormControl id='first-name' isRequired>
      <FormLabel>Name</FormLabel>
      <Input 
        placeholder='Enter Your Name'
        onChange={(e) => setName(e.target.value)}
      />
    </FormControl>

    <FormControl id='email' isRequired>
      <FormLabel>Email</FormLabel>
      <Input 
        placeholder='Enter Your Email'
        onChange={(e) => setEmail(e.target.value)}
      />
    </FormControl>

    <FormControl id='password' isRequired>
      <FormLabel>Password</FormLabel>
      <InputGroup>
        <Input
          type={show ? "text" : "password"} 
          placeholder='Enter Your Password'
          onChange={(e) => setPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl id='confirmPassword' isRequired>
      <FormLabel>Confirm Password</FormLabel>
      <InputGroup>
        <Input
          type={show ? "text" : "password"} 
          placeholder='Confirm Password'
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
        </InputRightElement>
      </InputGroup>
    </FormControl>

    <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
    </FormControl>

     <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>

  </VStack>
}

export default Signup
