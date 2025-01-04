import React from 'react';

import ModelSelector from './model_selector';

import './side_bar.css';


interface SideBarProps {
    setModel: (model: string) => void;
}


const SideBar: React.FC<SideBarProps> = ({ setModel }) => {
    return (
        <div className='side-bar'>
            <ModelSelector setModel={setModel} />
        </div>
    );
};

export default SideBar;
