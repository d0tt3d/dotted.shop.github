const FRAMES     = 21;
const FRAME_MS   = 0.18;
const CYCLE_TIME = FRAMES * FRAME_MS;

export default function handler(req, res) {
    const now   = Date.now() / 1000;
    const pos   = now % CYCLE_TIME;
    const frame = Math.floor(pos / FRAME_MS) + 1;
    const frac  = (pos % FRAME_MS) / FRAME_MS;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ frame, frac });
}
