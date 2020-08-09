const SongState = {
    SELECT: 'select',
    INSTRUCTIONS: 'instructions',
    RECORD: 'record',
    PLAYBACK: 'playback',
    UPLOADING: 'uploading',
    UPLOADED: 'uploaded'
}

export const stateOrder = {
    'select': 0,
    'instructions': 1,
    'record': 2,
    'playback': 3,
    'uploading': 4,
    'uploaded': 5
};


export default SongState;