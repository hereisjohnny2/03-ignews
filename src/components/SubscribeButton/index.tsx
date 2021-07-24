import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: number
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  return (
    <button className={styles.subscribeButton}>
      Subscribe Now
    </button>
  );
}