"use client";
import { FormEvent, useState } from "react";
import { useMutation } from "convex/react";
import { ChangeEvent } from "react";
import { api } from "../../../convex/_generated/api";

export default function Login() {
  const verify = useMutation(api.users.authenticateUser);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await verify({
        username: username,
        password: password,
      });

      if (result.success) {
        setView(true);
      } else {
        setError("error");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed. Please try again.");
    }
  };
  const languages = ["aleman", "portugues", "frances", "ingles", "español"];
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const getUploadUrl = useMutation(api.pdfFiles.generateUploadUrl);
  const sendPdf = useMutation(api.pdfFiles.sendPdf);
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && selectedLanguage) {
      const file = event.target.files[0];
      setPdfFile(file);
      const postUrl = await getUploadUrl();
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file!.type },
        body: file,
      });

      const { storageId } = await result.json();
      const status = await sendPdf({
        storeId: storageId,
        languaje: selectedLanguage,
      });
      console.log(status);
      if (status?.success) {
        window.alert(
          "Se a cargado correctanmente el pdf de " + selectedLanguage
        );
      }
    }
  };

  const handleButtonClick = (language: string) => {
    const element = document.getElementById("pdf-upload");
    if (!element) {
      return;
    }
    setSelectedLanguage(language);
    element.click(); // Trigger file input click
  };
  if (!view) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded bg-white p-8 shadow-md"
        >
          <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

          {error && (
            <div className="mb-4 rounded bg-red-200 p-3 text-red-700">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-2 block text-gray-700" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-gray-300 p-3 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-indigo-500 p-3 text-white hover:bg-indigo-600"
          >
            Login
          </button>
        </form>
      </div>
    );
  } else {
    return (
      <div className="mt-10 flex flex-col items-center justify-center space-y-4">
        <h2 className="mb-4 text-xl font-semibold">
          Carga el pdf del lenguaje correspondiente
        </h2>

        {languages.map((language, index) => (
          <button
            key={index}
            className="w-80 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none"
            onClick={() => handleButtonClick(language)}
          >
            cargar PDF para {language}
          </button>
        ))}

        <input
          id="pdf-upload"
          type="file"
          accept=".pdf"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    );
  }
}
