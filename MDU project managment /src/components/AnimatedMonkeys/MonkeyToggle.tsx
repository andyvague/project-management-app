import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useMonkeyContext } from '../../context/MonkeyContext';

const MonkeyToggle: React.FC = () => {
  const theme = useTheme();
  const { showMonkeys, toggleMonkeys } = useMonkeyContext();

  return (
    <Tooltip title={showMonkeys ? "Hide Animated Monkeys" : "Show Animated Monkeys"}>
      <IconButton
        onClick={toggleMonkeys}
        size="medium"
        sx={{
          color: theme.palette.text.primary,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        {showMonkeys ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </Tooltip>
  );
};

export default MonkeyToggle;
