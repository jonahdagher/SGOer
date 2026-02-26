import { useParams } from "react-router-dom"
import { useEffect, useMemo, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Paper,
  Box,
  Chip,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput
} from "@mui/material";
import { Calendar } from "@fullcalendar/core/index.js";

export default function DayPage({loadSgos, sgos, sgoMapper, selectedEvent, setSelectedEvent, loadBros, bros}){

    const { date } = useParams();
    
    useEffect(() => {
        if (!sgos || sgos.length === 0){
            loadSgos();
        }
    }, [sgos, loadSgos]);

    useEffect(() => {
        if (!bros || bros.length === 0){
            loadBros();
        }
    }, [bros, loadBros]);

    //Creating New Sgo
    const [open, setOpen] = useState(false)

    const localNow = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

    const [form, setForm] = useState({
        description: "",
        size: "",
        start: localNow,
        end: localNow,
        location: "",
        bro_ids: [],
        pnm_ids: []
    })

    console.log(bros)

    const sgosOnDate = useMemo(() => {
    return (Array.isArray(sgos) ? sgos : []).filter((sgo) => {
      const startDay = (sgo.start || "").slice(0, 10);
      return startDay === date;
    });
    }, [sgos, date]);

    const events = useMemo(() => sgoMapper(sgosOnDate), [sgosOnDate, sgoMapper]);
    // const selectedEvent = 

    return (
  <>
    <Container maxWidth="lg" sx={{ mt: 4, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 2, mb: 4, width: "100%" }}>
    <Toolbar sx={{gap: 4, flexWrap: "wrap", width: "100%", alignItems: "cen", py: 2, justifyContent: "space-between" }}>
    {!selectedEvent ? (
      <Typography color="text.secondary">Click an event to see details</Typography>
    ) : (
      <>

        <Box>
          <Typography variant="caption" color="text.secondary">Status</Typography>
          <Chip
            label={selectedEvent.filled ? "Full" : "Open"}
            color={selectedEvent.filled ? "warning" : "success"}
            size="small"
          />
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">Location</Typography>
          <Typography variant="body1">{selectedEvent.location}</Typography>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">Size</Typography>
          <Typography variant="body1">{selectedEvent.bros?.length} / {selectedEvent.size}</Typography>
        </Box>

        

        <Box>
          <Typography variant="caption" color="text.secondary">Bros</Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexDirection: "column" }}>
            {selectedEvent.bros?.map((id) => {
                const bro = bros.find((b) => b.id === id);
                return <Chip key={id} label={bro ? bro.name : id} size="small" />;
            })}
          </Box>
        </Box>

        <Box>
          <Typography variant="caption" color="text.secondary">PNMs</Typography>
          <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
            {selectedEvent.pnms?.map((p) => <Chip key={p} label={p} size="small" />)}
          </Box>
        </Box>
      </>
    )}
  </Toolbar>
</Paper>

      <Box sx={{ mt: 4, width: "100%" }}>
        <Paper elevation={3} sx={{ p: 2, width: "100%" }}>
          <Box sx={{ width: "100%" }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridDay"
              initialDate={date}
              height="auto"
              expandRows={true}
              headerToolbar={{ left: "", center: "", right: "" }}
              events={events}
              eventClick={(info) => setSelectedEvent(info.event.extendedProps)}
              dateClick={(info) => console.log(info.dateStr)}
            />
          </Box>
        </Paper>
      </Box>
    <Fab
    color="primary"
    sx={{position: "fixed", bottom: 32, right: 32}}
    onClick={() => setOpen(true)}
    >
        +
    </Fab>
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>Create an Sgo</DialogTitle>
            <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1}}>
                <TextField
                label="Desciption"
                value={form.description}
                onChange={(e) => setForm({...form, description: e.target.value})}
                fullWidth
                />

                <TextField
                label="Location"
                value={form.location}
                onChange={(e) => setForm({...form, location: e.target.value})}
                fullWidth
                />

                <TextField
                label="Size"
                type="number"
                value={form.size}
                onChange={(e) => setForm({...form, size: e.target.value})}
                htmlProps={{ min: 1, step: 1, max: 10 }}
                fullWidth
                />

                <TextField
                label="Start"
                type="datetime-local"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true}} 
                />

                <TextField
                label="End"
                type="datetime-local"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
                fullWidth
                InputLabelProps={{ shrink: true }}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button>Submit</Button>
            </DialogActions>
        </Dialog>
    </Container>
  </>
);
}