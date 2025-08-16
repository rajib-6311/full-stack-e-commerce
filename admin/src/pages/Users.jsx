import axios from "axios";
import { useEffect, useState } from "react";
import toast from 'react-hot-toast'
import { serverURL } from "../../config.js";
import { RxCross2 } from "react-icons/rx";
import Loader from "../components/Loader.jsx";


const Users = ({ token }) => {
  const [userList, setUsersList] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  const getUserList = async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(serverURL + "/api/user/users", {
        headers: {
          token,
          "Content-Type": "Application/json",
        }
      })
      const data = response?.data
      console.log(data)

      if (data?.success) {
        setUsersList(data?.users)
      }
      else {
        toast.error(data?.message)
      }

    } catch (error) {
      console.log('Users list fating error', error?.message)
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getUserList()
  }, [])
  return (
    <div>
      {
        isLoading ? (
          <Loader />
        ) :
          (
            <div>
              <h1>User List</h1>
              {
                userList?.length > 0 ?
                  <div className="max-w-4xl flex flex-col gap-2 mt-2">
                    <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center py-2 px-2 border bg-gray-100 my-1.5">
                      <b>Name</b>
                      <b>Email</b>
                      <b>Admin</b>
                      <b>Action</b>
                      <b>Edit</b>
                    </div>

                    {
                      userList?.map((item) => (
                        <div
                          key={item?._id}
                          className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_2fr_1fr_1fr_1fr] items-center py-2 px-2 border my-1.5"
                        >
                          <p>{item?.name}</p>
                          <p>{item?.email}</p>
                          <p className={item.isAdmin ? 'text-blue-500 font-bold' : 'text-normal'}>{item.isAdmin ? 'Admin' : 'User'}</p>
                          <RxCross2 />
                          <button className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                        </div>
                      ))
                    }

                  </div>

                  :
                  (<div>
                    <h1>You have no user in database</h1>
                    {/* <button className="bg-black text-white rounded-full px-4 py-2 ">Add User</button> */}
                    <div class="relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#00F5FF,_#00F5FF30,_#00F5FF)] button-wrapper">
                      <button class="relative z-10 bg-gray-800 text-white rounded-full px-8 py-3 font-medium text-sm">Add User</button>
                    </div>
                  </div>)
              }
            </div>
          )
      }
    </div>
  );
};

export default Users;