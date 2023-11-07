import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SourceIcon from '@mui/icons-material/Source';
import BusinessIcon from "@mui/icons-material/Business";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import HandshakeIcon from "@mui/icons-material/Handshake";
import Groups2Icon from "@mui/icons-material/Groups2";
import CrisisAlertSharpIcon from "@mui/icons-material/CrisisAlertSharp";
import CategoryIcon from "@mui/icons-material/Category";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LanguageIcon from "@mui/icons-material/Language";
import ScaleIcon from '@mui/icons-material/Scale';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import './sidebar.css';
import { HiUserGroup } from 'react-icons/hi'

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
      className="sidebar"
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <HiUserGroup style={{ width: "30px", height: "30px", marginBottom: "10px" }} /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>

                  <HiUserGroup onClick={() => setIsCollapsed(!isCollapsed)} style={{ width: "30px", height: "30px", marginBottom: "10px" }} />
                  <h4>                  User Management
                  </h4>
                </Typography>
                {/* <MenuOutlinedIcon /> */}

              </Box>
            )}
          </MenuItem>

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Register"
              to="/register"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Login"
              to="/login"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />


            <Item
              title="Users List"
              to="/users"
              icon={<DashboardIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="User Page"
              to="/user"
              icon={<DashboardIcon />}
              selected={selected}
              setSelected={setSelected}
            />





          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
