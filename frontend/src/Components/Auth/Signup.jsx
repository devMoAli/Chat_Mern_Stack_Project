import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { register } = useUser();

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async () => {
    setImageLoading(true);

    // Basic form validation
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Please fill in all fields.",
        status: "warning",
      });
      setImageLoading(false);
      return;
    }

    // Passwords matching validation
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match.",
        status: "warning",
      });
      setImageLoading(false);
      return;
    }

    try {
      await register(username, email, password, image);

      // Registration successful
      toast({
        title: "Registration Successful",
        status: "success",
      });

      setImageLoading(false);
      navigate("/chats");
    } catch (error) {
      // Registration failed
      const errorMessage =
        error.response?.data.message ||
        "Something went wrong. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        status: "error",
      });
      setImageLoading(false);
    }
  };

  return (
    <VStack spacing="5">
      <FormControl id="signup-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="signup-password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-confirm-password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleTogglePassword}>
              {showPassword ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="signup-pic">
        <FormLabel>Upload Your Picture</FormLabel>
        <Input
          type="file"
          p="1.5"
          accept="image/*"
          onChange={handleImageChange}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: "15px" }}
        onClick={submitHandler}
        isLoading={imageLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
