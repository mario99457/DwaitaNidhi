import React, { useEffect, useRef, useState } from "react";
import ReactHowler from "react-howler";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import CloseIcon from "@mui/icons-material/Close";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import audioSample from "../../assets/audio/bsb_full.mp3";
import { Box, Slider, Stack, Typography } from "@mui/material";
import raf from "raf";
import { Title } from "../../types/GlobalType.type";

interface AudioPlayerProps {
  selectedTitle: Title;
  handleClosePlayer: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  selectedTitle,
  handleClosePlayer,
}) => {
  const [playing, setIsPlaying] = useState(false);
  const [paused, setPaused] = React.useState(false);
  const [duration, setDuration] = useState<number | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [seek, setSeek] = useState(0.0);
  const [isSeeking, setIsSeeking] = useState(false);

  const playerRef = useRef<ReactHowler | null>(null);
  const rafRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const seekingRef = useRef(false);

  function formatDuration(value: number) {
    const tempVal = parseInt(value);
    if (isNaN(tempVal)) {
      return "NaN";
    }
    const minute = Math.floor(tempVal / 60);
    const secondLeft = tempVal - minute * 60;
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
  }

  useEffect(() => {
    return () => {
      clearRAF();
    };
  }, []);

  // useEffect(() => {
  //   let url = "https://github.com/mario99457/dwaitanidhi_data/raw/refs/heads/main/sutraani/sutra_audio_complete.ogg";
  //   var audio = getResourceFromGit(url);
  //   setAudioSutra(audio)
  // })

  const handleOnLoad = () => {
    setLoaded(true);
    if (playerRef.current) {
      setDuration(playerRef.current?.duration());
      setIsPlaying(true);
      setPaused(false);
      playingRef.current = true;
    }
  };

  const handleMouseDownSeek = (e) => {
    setIsSeeking(true);
    seekingRef.current = true;
  };

  const handleMouseUpSeek = (e) => {
    setIsSeeking(false);
    const inputElement = e.currentTarget.querySelector("input");
    seekingRef.current = false;
    if (playerRef.current && inputElement) {
      const inputVal = parseFloat(inputElement.value / 10);
      playerRef.current.seek(inputVal);
    }
  };

  const handleOnPlay = () => {
    setIsPlaying(true);
    playingRef.current = true;
    renderSeekPos();
  };

  // const renderSeekPos = () => {
  //   if (!seekingRef.current) {
  //     setSeek(playerRef.current.seek());
  //   }
  //   if (playingRef.current) {
  //     rafRef.current = raf(renderSeekPos);
  //   }
  // };

  const clearRAF = () => {
    if (rafRef.current) {
      raf.cancel(rafRef.current);
    }
  };

  const handleSeekingChange = (e) => {
    setSeek(parseFloat(e.target.value / 10));
  };

  return (
    <Box
      justifyContent="center"
      display="flex"
      width="100%"
      sx={{
        position: "absolute",
        top: "5px",
        left: "10px",
      }}
    >
      <CloseIcon
        sx={{
          position: "absolute",
          right: "21%",
          top: "5px",
          color: "#D99595",
          cursor: "pointer",
          fontSize: "18px",
        }}
        onClick={handleClosePlayer}
      />
      <Box bgcolor="#250909" borderRadius="9px" padding="10px 6%" width="60%">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            color="#D99595"
            fontSize="12px"
            fontFamily="Poppins"
            minWidth={40}
          >
            {formatDuration(seek)}
          </Typography>
          <Typography color="#BC4501" fontSize="12px" fontFamily="Vesper Libre">
            {selectedTitle.s}
          </Typography>
          <Typography
            color="#D99595"
            fontSize="12px"
            fontFamily="Poppins"
            minWidth={40}
          >
            {duration ? formatDuration(duration) : "NaN"}
          </Typography>
        </Stack>
        <Slider
          aria-label="time-indicator"
          size="small"
          min={0}
          max={duration ? parseInt(duration * 10) : 0}
          step={0.01}
          value={parseInt(seek * 10)}
          onChange={handleSeekingChange}
          onMouseDown={handleMouseDownSeek}
          onMouseUp={handleMouseUpSeek}
          sx={(t) => ({
            color: "#762C2C",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              backgroundColor: "#D99595",
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&::before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: "none",
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-track": {
              backgroundColor: "#D99595",
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
            ...t.applyStyles("dark", {
              color: "#fff",
            }),
          })}
        />
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <SkipPreviousIcon
            sx={{ color: "#888888", cursor: "pointer" }}
            onClick={() => {}}
          />
          {playing ? (
            <PauseCircleIcon
              onClick={() => {
                setIsPlaying(false);
                setPaused(true);
                playingRef.current = false;
              }}
              sx={{ color: "#888888", cursor: "pointer" }}
              fontSize="large"
            />
          ) : (
            <PlayCircleIcon
              onClick={() => {
                setIsPlaying(true);
                setPaused(false);
                playingRef.current = true;
              }}
              sx={{ color: "#888888", cursor: "pointer" }}
              fontSize="large"
            />
          )}
          <SkipNextIcon
            sx={{ color: "#888888", cursor: "pointer" }}
            // onClick={() => playerRef.current.}
          />
        </Stack>
      </Box>

      <ReactHowler
        src={audioSample}
        playing={playing}
        // html5={true}
        onEnd={() => {
          playingRef.current = false;
          setIsPlaying(false);
        }}
        ref={playerRef}
        onLoad={handleOnLoad}
        onPlay={handleOnPlay}
      />
    </Box>
  );
};

export default AudioPlayer;
