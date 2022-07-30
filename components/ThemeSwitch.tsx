import styles from "styles/ThemeSwitch.module.css";

interface Props {
    isDark: boolean;
    onChange: () => void;
    invertedIconLogic?: boolean;
}


const ThemeSwitch = ({ isDark, onChange, invertedIconLogic = true }: Props) => (
    <label className={styles.container} title={isDark ? "Activate light mode" : "Activate dark mode"} aria-label={isDark ? "Activate light mode" : "Activate dark mode"}>
        <input type="checkbox" defaultChecked={invertedIconLogic ? !isDark : isDark} onChange={onChange} />
        <div />
    </label>
);

export default ThemeSwitch;
