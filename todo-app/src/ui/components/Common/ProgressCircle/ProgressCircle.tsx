import style from './ProgressCircle.module.css';

interface ProgressCircleProps {
    percent?: number;
    color?: string;
    title?: string;
}

function ProgressCircle({ percent = 84, color = '#00ba00', title = "completed" }: ProgressCircleProps) {
    // Calculate offset for progress
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - percent / 100);
    return (
        <div className={style['progress-circle']}>
            <svg>
                <circle cx="60" cy="60" r={radius} className={style.bg}></circle>
                <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className={style.progress}
                    style={{ strokeDashoffset: offset, stroke: color }}
                ></circle>
            </svg>
            <div className={style.text}>{percent}%</div>
            <div className={style.progressTitle} style={{ color }}>
                <span
                    style={{
                        width: 10,
                        height: 10,
                        backgroundColor: color,
                        borderRadius: '50%',
                        marginRight: 8,
                        display: 'inline-block',
                        verticalAlign: 'middle',
                    }}
                ></span>
                {title}
            </div>
        </div>
    );
}

export default ProgressCircle;