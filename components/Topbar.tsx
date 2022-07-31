import { useState } from "react";
import { AppBar, Avatar, Box, Button, Grid, IconButton, Menu, MenuItem, Typography, useTheme } from "@mui/material";
import ThemeSwitch from "components/ThemeSwitch";
import { useUser } from "@auth0/nextjs-auth0";
import { ThemeMode, useAppContext } from "context/AppContext";
import Link from "next/link";


/**
 * Topbar component
 *
 * @return {*} 
 */
const TopBar = () => {
    const theme = useTheme();
    const { user, error, isLoading } = useUser();
	const { toggleColorMode } = useAppContext();
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Box px={[theme.spacing(2), theme.spacing(4), theme.spacing(6), theme.spacing(8)]} display="flex" justifyContent={"space-between"} alignItems="center">
                <h2>
                    <span style={{ fontSize: "32px" }}>✓</span> Task Management
                </h2>
                <Grid display="flex">
                    {user ? (
                        <Box mr={theme.spacing(4)}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={user.email!} src={user.picture!} />
                            </IconButton>
                            <Menu
                                sx={{ mt: "45px" }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "right",
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                <Link href="/api/auth/logout">
                                    <MenuItem onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Logout</Typography>
                                    </MenuItem>
                                </Link>
                            </Menu>
                        </Box>
                    ) : (
                        <Link href="/api/auth/login">
                            <Button sx={{ marginRight: theme.spacing(4) }} variant="contained">
                                Login
                            </Button>
                        </Link>
                    )}
                    <ThemeSwitch isDark={theme.palette.mode === ThemeMode.dark} onChange={toggleColorMode} />
                </Grid>
            </Box>
        </AppBar>
    );
}

export default TopBar;