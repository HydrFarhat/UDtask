import { Box, IconButton, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import Divider from "@mui/material/Divider";
import UserModal from "../../Modals/UserModal";
import{BiLogOutCircle} from'react-icons/bi'
import { useNavigate } from 'react-router-dom';


const Navbar = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const [userRegister,setUserRegister] = useState(false)
  const navigate = useNavigate();

  const logout = ()=>{

    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate('/login');


  }


  return (
    <div>
      <Box display="flex" justifyContent="space-between" p={2}>
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
        
        </Box>
        <Box display="flex">
         
          {/* <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon  />
          </IconButton> */}
          <IconButton>
          <BiLogOutCircle onClick={()=>logout()}/>
          </IconButton>

        </Box>
      </Box>

      <Divider light />
 
    </div>
  );
};

export default Navbar;
