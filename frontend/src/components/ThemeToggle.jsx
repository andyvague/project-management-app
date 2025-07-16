import React from 'react'
import { IconButton, Tooltip, Box } from '@mui/material'
import { Brightness4, Brightness7 } from '@mui/icons-material'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle = ({ sx = {} }) => {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <Box sx={sx}>
      <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
        <IconButton
          onClick={toggleDarkMode}
          color="inherit"
          sx={{
            p: 1,
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              transform: 'scale(1.1)',
            },
          }}
        >
          {darkMode ? (
            <Brightness7 sx={{ fontSize: 24 }} />
          ) : (
            <Brightness4 sx={{ fontSize: 24 }} />
          )}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ThemeToggle 