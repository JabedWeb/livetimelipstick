"use client";

import { Box,Modal, Typography } from "@mui/material";
import React, { useState } from "react";
import Image from "next/image";

export const Otp = () => {
  const [open, setOpen] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const rawValue = e.target.value;
    const value: number = Number(rawValue);

    if (!isNaN(value) && rawValue.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = rawValue;
      setOtp(newOtp);
      // Move to next input automatically
      if (index < 5 && value) {
        const nextInput = document.getElementById(`otp${index + 1}`);
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const successfullPopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    console.log("Modal closing...");
    setOpen(false);
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    backgroundColor: "white",
    textAlign: "center",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="md:flex items-center">
      {/* Left side image */}
      <div className="md:w-1/2">
        <Image
          src="/login.png"
          alt="login page"
          width={500}
          height={500}
          className="w-full"
        />
      </div>

      {/* Right side form */}
      <div className="md:w-1/2 p-4">
        <h1 className="text-3xl font-semibold mb-2">Enter OTP</h1>
        <p className="text-gray-500 mb-4">
          We have shared a code to your registered email address
          <br />
          jabed@example.com
        </p>

        {/* OTP Input Fields */}
        <form>
          <div className="flex justify-between mb-4">
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp${index}`}
                type="text"
                value={otp[index]}
                maxLength={1}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-2xl border-2 rounded-md  focus:border-black"
              />
            ))}
          </div>
          <button
            className="w-full cursor-pointer bg-black text-white py-3 px-2 rounded-md font-semibold mt-2"
            onClick={successfullPopup}
          >
            Verify
          </button>
        </form>


        {/* Modal */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          closeAfterTransition
          sx={{
            backdropFilter: "blur(10px)",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <Box sx={style}>
            <Typography
              sx={{ fontWeight: "bold", fontSize: 35 }}
              id="modal-modal-title"
              variant="h2"
              component="h2"
            >
              Password Changed Successfully
            </Typography>
            <Typography
              id="modal-modal-description"
              sx={{ mt: 2, fontWeight: "bold" }}
            >
              Your password has been updated successfully. Please login with
              your new password.
            </Typography>
            <button
              className="bg-black text-center text-white rounded-md py-2 px-2 w-full mt-3"
              onClick={handleClose}
            >
              Back To Login
            </button>
          </Box>
        </Modal>
      </div>
    </div>
  );
};
