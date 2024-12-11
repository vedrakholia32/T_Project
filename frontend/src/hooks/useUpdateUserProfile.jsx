import { useState } from "react";
import toast from "react-hot-toast";

const useUpdateUserProfile = () => {
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const updateProfile = async (formData) => {
    try {
      setIsUpdatingProfile(true);
      const response = await fetch("/api/user/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      const data = await response.json();

      // Show success message after the profile update
      toast.success("Profile updated successfully!");

	  setTimeout(() => {
        window.location.reload();
      }, 1000); 
      return data;
    } catch (error) {
      console.error("Error updating profile:", error);

      // Show error message if profile update fails
      toast.error(error.message);
      throw error;
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
