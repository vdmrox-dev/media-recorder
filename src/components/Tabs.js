import React, { useState } from "react";
import Tab from "./Tab";
import "../css/Tabs.css";

export default function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(children[0].props.label);

  const tabsList = () => {
    return children.map((tab, index) => {
      return (
        <Tab
          key={index}
          label={tab.props.label}
          onClick={() => setActiveTab(tab.props.label)}
          isActive={activeTab === tab.props.label}
        />
      )
    });
  }

  const activeTabContent = () => {
    const selectedTab = children.find((tab) => {
      return tab.props.label === activeTab;
    });

    return selectedTab.props.children;
  }

  return (
    <div className="tabs">
      <ul className="tabs-list">{tabsList()}</ul>
      <div className="tab-content">{activeTabContent()}</div>
    </div>
  );
}
