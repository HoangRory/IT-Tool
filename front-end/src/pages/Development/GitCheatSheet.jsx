import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
export default function RandomPortGenerator() {
    return (
        <div className="max-w-3xl mx-auto p-6 space-y-5">
            <h2 className="text-3xl font-bold text-gray-800">Git CheatSheet</h2>
            <p className="text-sm text-gray-600 mt-2">
                Git is a decentralized version management software. With this cheatsheet, you will have quick access to the most common git commands.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Configuration</h2>
            <span className="text-sm text-gray-700 whitespace-nowrap">Set the global config</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git config --global user.name "[name]" <br />
                git config --global user.email "[email]"</p>


            <h2 className="text-2xl font-semibold mb-2">Get started</h2>
            <span className="text-sm text-gray-700 whitespace-nowrap">Create a git repository</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git init</p>
            <span className="text-sm text-gray-700 whitespace-nowrap">Clone an existing git repository</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git clone [url]</p>

            <h2 className="text-2xl font-semibold mb-2">I’ve made a mistake</h2>

            <span className="text-sm text-gray-700 whitespace-nowrap">Change last commit message</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git commit --amend"</p>
            <span className="text-sm text-gray-700 whitespace-nowrap">Undo most recent commit and keep changes</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git reset HEAD~1</p>
            <span className="text-sm text-gray-700 whitespace-nowrap">Undo the N most recent commit and keep changes</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git reset HEAD~N</p>
            <span className="text-sm text-gray-700 whitespace-nowrap">Undo most recent commit and get rid of changes</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git reset HEAD~1 --hard</p>
            <span className="text-sm text-gray-700 whitespace-nowrap">Reset branch to remote state</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git fetch origin <br />git reset --hard origin/[branch-name]</p>

            <h2 className="text-2xl font-semibold mb-2">Miscellaneous</h2>

            <span className="text-sm text-gray-700 whitespace-nowrap">Renaming the local master branch to main</span>
            <p className="bg-white shadow-md rounded-xl p-4 space-y-2 mt-1">git branch -m master main</p>

        </div>

    );
}