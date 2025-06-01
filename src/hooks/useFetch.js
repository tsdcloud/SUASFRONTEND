import { useState, useEffect, useContext } from "react";
// import { authProvider } from "./AuthContext";


export const useFetch = () => {
    const [err, setErr] = useState("");
    // const { token } = useContext(authProvider)
    let token = localStorage.getItem("token");

    const handleFetch = async (url) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };
          
          try {
            let response = await fetch(url, requestOptions);
            let result = await response.json(); 
            if(response.ok){
                return result 
            }
            setErr(result);
            return result;
        } catch (error) {
            setErr(error);
            return error
        }
       
    }
 
    const handlePost = async (url, data, withAuth = true) => {
        const myHeaders = new Headers();
        if(withAuth){
            myHeaders.append("Authorization", `Bearer ${token}`);
        }
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify(data);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
        };

        try {
            let response = await fetch(url, requestOptions);
            let result = await response.json();
            return result;
        } catch (error) {
            throw new Error("Erreur du serveur");
        }
    }

    const handlePatch = async (url) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");
       
        const requestOptions = {
            method: "PATCH",
            headers: myHeaders,
            redirect: "follow"
          };
        try {
            let response = await fetch(url, requestOptions);
            let result = await response.text();
            console.log("result",result)
            console.log("response",response)   
            if(response.ok){
                return result 
            }
            setErr(result?.error);
            return result;
        } catch (error) {
            setErr(error);
            return error
        }
    }

    const handlePostFile = async (urlEndPoint, file) => {
        
        const formData = new FormData();
        formData.append("files", file);
    
        const requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow"
        };
    
        try {
            let response = await fetch(urlEndPoint, requestOptions);
            const result = await response.json(); // Parse la réponse JSON
    
            if (response.ok) {
                return result; // Retourne l'objet JSON complet
            } else {
                setErr(result?.error);
                return result;
            }
        } catch (error) {
            setErr(error);
            return error;
        }
    };

  return { handleFetch, handlePost, err, setErr, handlePostFile, handlePatch }
}