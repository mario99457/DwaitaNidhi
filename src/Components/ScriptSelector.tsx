import { FormControl, MenuItem, Select, Typography } from "@mui/material";

const commentaryScriptOptions = [
  { value: 'devanagari', label: 'Devanagari (Sanskrit)' },
  { value: 'iast', label: 'English' },
  { value: 'kannada', label: 'Kannada' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
];

export const getScriptPreference = () =>
  typeof window !== 'undefined' && localStorage.getItem('scriptPreference') || 'devanagari';

export const setScriptPreference = (script: string) =>
  typeof window !== 'undefined' && localStorage.setItem('scriptPreference', script);

export default function ScriptSelector({
  script,
  setScript,
  sx,
}: {
  script: string;
  setScript: (s: string) => void;
  sx?: any;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 16, ...sx }}>
      <Typography sx={{ mr: 2, fontWeight: 500, fontSize: 16, color: '#A74600' }}>
        Commentary Language:
      </Typography>
      <FormControl size="small" sx={{ minWidth: 140, background: '#FCF4CD', borderRadius: 1 }}>
        <Select
          value={script}
          onChange={e => setScript(e.target.value)}
        >
          {commentaryScriptOptions.map(opt => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
} 