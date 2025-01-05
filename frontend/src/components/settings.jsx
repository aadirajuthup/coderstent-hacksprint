// src/components/settings.jsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster, toast } from 'sonner'

const Settings = () => {
    const [apiKey, setApiKey] = useState('');
    const [baseUrl, setBaseUrl] = useState('');
    const [modelName, setModelName] = useState('');

    useEffect(() => {
        // Load settings from local storage on component mount
        const storedApiKey = localStorage.getItem('apiKey');
        const storedBaseUrl = localStorage.getItem('baseUrl');
        const storedModelName = localStorage.getItem('modelName');

        if (storedApiKey) setApiKey(storedApiKey);
        if (storedBaseUrl) setBaseUrl(storedBaseUrl);
        if (storedModelName) setModelName(storedModelName);
    }, []);

    const handleSave = () => {
        // Validate input (add more validation as needed)
        if (!apiKey || !baseUrl) {
            toast.error("Please fill in all fields");
            return;
        }

        // Save settings to local storage
        localStorage.setItem('apiKey', apiKey);
        localStorage.setItem('baseUrl', baseUrl);
        localStorage.setItem('modelName', modelName);

        toast.success("Settings saved successfully!");
    };

    return (
        <div className="p-4">
            <Toaster />
            <h2 className="text-xl font-bold mb-4">Settings</h2>
            <div className="mb-4">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                    id="apiKey"
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your API key"
                    className="mt-2"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                    id="baseUrl"
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="Enter the base URL"
                    className="mt-2"
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="modelName">Model</Label>
                <Select value={modelName} onValueChange={setModelName}>
                    <SelectTrigger id="modelName" className="mt-2">
                        <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                        {/* Add more models here */}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
        </div>
    );
};

export default Settings;