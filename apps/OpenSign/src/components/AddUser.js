import React, { useEffect, useState } from "react";
import Parse from "parse";
import Title from "./Title";
import Loader from "../primitives/Loader";
import {
  copytoData,
  usertimezone
} from "../constant/Utils";
import {
  emailRegex,
} from "../constant/const";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function generatePassword(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const AddUser = (props) => {
  const { t } = useTranslation();
  const [formdata, setFormdata] = useState({
    name: "",
    phone: "",
    email: "",
    team: "",
    password: "",
    role: ""
  });
  const [isFormLoader, setIsFormLoader] = useState(false);
  const [teamList, setTeamList] = useState([]);
  // const role = ["OrgAdmin", "Editor", "User"];
  const role = ["User"];
  const djangoUrl = process.env.REACT_APP_DJANGO_URL;
  const djangoUser = JSON.parse(localStorage.getItem('djangoUser'));
  const djangoToken = localStorage.getItem('django');

  useEffect(() => {
    getTeamList();
    // eslint-disable-next-line
  }, []);

  const getTeamList = async () => {
    const teamRes = await Parse.Cloud.run("getteams", { active: true });
    if (teamRes.length > 0) {
      const _teamRes = JSON.parse(JSON.stringify(teamRes));
      setTeamList(_teamRes);
        const allUserId =
          _teamRes.find((x) => x.Name === "All Users")?.objectId || "";
        setFormdata((prev) => ({ ...prev, team: allUserId }));
    }
  };
  const checkUserExist = async () => {
    try {
      const res = await Parse.Cloud.run("getUserDetails", {
        email: formdata.email
      });
      if (res) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  // Define a function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!emailRegex.test(formdata.email)) {
      // toast.error("Please enter a valid email address.");
      props.setIsAlert({type: "danger", msg: "Please enter a valid email address."});
    } else {
      const localUser = JSON.parse(localStorage.getItem("Extand_Class"))?.[0];
      setIsFormLoader(true);
      const res = await checkUserExist();
      if (res) {
        props.setIsAlert({ type: "danger", msg: t("user-already-exist") });
        setIsFormLoader(false);
        setTimeout(() => props.setIsAlert({ type: "success", msg: "" }), 1000);
      } else {
        try {
          // Split the name into first and last name for the Django API
          const nameParts = formdata.name.split(" ");
          const firstName = nameParts[0] || "";
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

          // Check if last name is empty
          if (!lastName) {
            // toast.error("Please enter full name");
            props.setIsAlert({ type: "danger", msg: "Please enter full name."});
            setIsFormLoader(false);
            return; // Exit the function if last name is not present
          }
          
          // Call Django register API
          
          const response = await axios.post(`${djangoUrl}/base/api/v1/register/`, {
            first_name: firstName,
            last_name: lastName,
            email: formdata.email,
            phone_number: formdata.phone || "",
            password: formdata.password,
            country: djangoUser.country, // You might want to add this to your form
            company_name: localUser?.Company || "",
            user_type: 'user'
          }, {
            headers: {
              Authorization: `Bearer ${djangoToken}`,
              'Content-Type': 'application/json',
            }
          });

          console.log("Registration Process :", response.data);

          const extUser = new Parse.Object("contracts_Users");
          extUser.set("Name", formdata.name);
          if (formdata.phone) {
            extUser.set("Phone", formdata.phone);
          }
          extUser.set("Email", formdata.email);
          extUser.set("UserRole", `contracts_${formdata.role}`);
          if (formdata?.team) {
            extUser.set("TeamIds", [
              {
                __type: "Pointer",
                className: "contracts_Teams",
                objectId: formdata.team
              }
            ]);
          }
          if (localUser && localUser.OrganizationId) {
            extUser.set("OrganizationId", {
              __type: "Pointer",
              className: "contracts_Organizations",
              objectId: localUser.OrganizationId.objectId
            });
          }
          if (localUser && localUser.Company) {
            extUser.set("Company", localUser.Company);
          }

          if (localStorage.getItem("TenantId")) {
            extUser.set("TenantId", {
              __type: "Pointer",
              className: "partners_Tenant",
              objectId: localStorage.getItem("TenantId")
            });
          }
          const timezone = usertimezone;
          if (timezone) {
            extUser.set("Timezone", timezone);
          }
          try {
            const _users = Parse.Object.extend("User");
            const _user = new _users();
            _user.set("name", formdata.name);
            _user.set("username", formdata.email);
            _user.set("email", formdata.email);
            _user.set("password", formdata.password);
            if (formdata.phone) {
              _user.set("phone", formdata.phone);
            }

            const user = await _user.save();
            if (user) {
              // Success toast for user creation
              // toast.success(t("user-created-successfully"));
              props.setIsAlert({ type: "success", msg: t("user-created-successfully") });

              const currentUser = Parse.User.current();
              extUser.set(
                "CreatedBy",
                Parse.User.createWithoutData(currentUser.id)
              );

              extUser.set("UserId", user);
              const acl = new Parse.ACL();
              acl.setPublicReadAccess(true);
              acl.setPublicWriteAccess(true);
              acl.setReadAccess(currentUser.id, true);
              acl.setWriteAccess(currentUser.id, true);

              extUser.setACL(acl);

              const res = await extUser.save();

              const parseData = JSON.parse(JSON.stringify(res));

              if (props.closePopup) {
                props.closePopup();
              }
              if (props.handleUserData) {
                if (formdata?.team) {
                  const team = teamList.find(
                    (x) => x.objectId === formdata.team
                  );
                  parseData.TeamIds = parseData.TeamIds.map((y) =>
                    y.objectId === team.objectId ? team : y
                  );
                }
                props.handleUserData(parseData);
              }

              setIsFormLoader(false);
              setFormdata({
                name: "",
                email: "",
                phone: "",
                team: "",
                role: ""
              });
            }
          } catch (err) {
            console.log("err ", err);
            if (err.code === 202) {
              const params = { email: formdata.email };
              const userRes = await Parse.Cloud.run("getUserId", params);
              const currentUser = Parse.User.current();
              extUser.set(
                "CreatedBy",
                Parse.User.createWithoutData(currentUser.id)
              );

              extUser.set("UserId", {
                __type: "Pointer",
                className: "_User",
                objectId: userRes.id
              });
              const acl = new Parse.ACL();
              acl.setPublicReadAccess(true);
              acl.setPublicWriteAccess(true);
              acl.setReadAccess(currentUser.id, true);
              acl.setWriteAccess(currentUser.id, true);

              extUser.setACL(acl);
              const res = await extUser.save();

              const parseData = JSON.parse(JSON.stringify(res));
              if (props.closePopup) {
                props.closePopup();
              }
              if (props.handleUserData) {
                if (formdata?.team) {
                  const team = teamList.find(
                    (x) => x.objectId === formdata.team
                  );
                  parseData.TeamIds = parseData.TeamIds.map((y) =>
                    y.objectId === team.objectId ? team : y
                  );
                }
                props.handleUserData(parseData);
              }
              setIsFormLoader(false);
              setFormdata({
                name: "",
                email: "",
                phone: "",
                team: "",
                role: ""
              });
            }
          }
        } catch (err) {
          console.log("err", err);
          setIsFormLoader(false);
          // toast.error(t("something-went-wrong-mssg"));
          props.setIsAlert({ type: "danger", msg: t("something-went-wrong-mssg") });
        } finally {
          setTimeout(
            () => props.setIsAlert({ type: "success", msg: "" }),
            1500
          );
        }
      }
    }
  };

  // Define a function to handle the "add yourself" checkbox
  const handleReset = () => {
    setFormdata({ name: "", email: "", phone: "", team: "", role: "" });
    if (props.closePopup) {
      props.closePopup();
    }
  };
  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "email") {
      value = value?.toLowerCase()?.replace(/\s/g, "");
    } else if (name === "phone") {
      // Validate that the phone value is a positive integer
      if (!/^\d*$/.test(value) || parseInt(value) <= 0) {
        alert("Please enter a valid positive integer for phone.");
        return; // Exit the function if the value is invalid
      }
    }
    setFormdata((prev) => ({ ...prev, [name]: value }));
  };

  const copytoclipboard = (text) => {
    copytoData(text);
    props.setIsAlert({ type: "success", msg: t("copied") });
    setTimeout(() => props.setIsAlert({ type: "success", msg: "" }), 1500); // Reset copied state after 1.5 seconds
  };
  return (
    <div className="shadow-md rounded-box my-[1px] p-3 bg-base-100 relative">
      {/* <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <Title title={t("add-user")} />
      {isFormLoader && (
        <div className="absolute w-full h-full inset-0 flex justify-center items-center bg-base-content/30 z-50">
          <Loader />
        </div>
      )}
              <div className="w-full mx-auto">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label
                          htmlFor="name"
                          className="block text-xs text-gray-700 font-semibold"
                        >
                          {t("name")}
                          <span className="text-[red] text-[13px]"> *</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formdata.name}
                          onChange={(e) => handleChange(e)}
                          placeholder="Name should be matched as govt document"
                          onInvalid={(e) =>
                            e.target.setCustomValidity(t("input-required"))
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          required
                          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="email"
                          className="block text-xs text-gray-700 font-semibold"
                        >
                          {t("email")}
                          <span className="text-[red] text-[13px]"> *</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formdata.email}
                          onChange={(e) => handleChange(e)}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(t("input-required"))
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="password"
                          className="block text-xs text-gray-700 font-semibold"
                        >
                          {t("password")}
                          <span className="text-[red] text-[13px]"> *</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formdata.password}
                          onChange={(e) => handleChange(e)}
                          required
                          onInvalid={(e) =>
                            e.target.setCustomValidity(t("input-required"))
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="phone"
                          className="block text-xs text-gray-700 font-semibold"
                        >
                          {t("phone")}
                          <span className="text-[red] text-[13px]"> *</span>
                        </label>
                        <input
                          type="text"
                          name="phone"
                          value={formdata.phone}
                          onChange={(e) => handleChange(e)}
                          required
                          maxLength={10}
                          className="op-input op-input-bordered op-input-sm focus:outline-none hover:border-base-content w-full text-xs"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="phone"
                          className="block text-xs text-gray-700 font-semibold"
                        >
                          {t("Role")}
                          <span className="text-[red] text-[13px]"> *</span>
                        </label>
                        <select
                          value={formdata.role}
                          onChange={(e) => handleChange(e)}
                          name="role"
                          className="op-select op-select-bordered op-select-sm focus:outline-none hover:border-base-content w-full text-xs"
                          onInvalid={(e) =>
                            e.target.setCustomValidity(t("input-required"))
                          }
                          onInput={(e) => e.target.setCustomValidity("")}
                          required
                        >
                          <option defaultValue={""} value={""}>
                            {t("Select")}
                          </option>
                          {role.length > 0 &&
                            role.map((x) => (
                              <option key={x} value={x}>
                                {x}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="flex items-center mt-3 gap-2 text-white">
                        <button type="submit" className="op-btn op-btn-primary">
                          {t("submit")}
                        </button>
                        <div
                          type="button"
                          onClick={() => handleReset()}
                          className="op-btn op-btn-secondary"
                        >
                          {t("cancel")}
                        </div>
                      </div>
                    </form>
              </div>
    </div>
  );
};

export default AddUser;
