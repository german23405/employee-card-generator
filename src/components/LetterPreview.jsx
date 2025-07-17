import React from "react";
import dayjs from "dayjs";
import styles from "./LetterPreview.module.css";

export default function LetterPreview({
  fullName = "@fullname",
  position = "@position",
  teamName = "@team",
  direction = "@direction",
  firstDate = "@date",
  telegram = "@telegram"
}) {
  return (
    <main className={styles.letterContainer}>
      <section>
        <h1 className={styles.h1}>Привіт, <span className={styles.variable}>{fullName || "@fullname"}</span>!</h1>
        <p className={styles.p}>
          Ти прийняв(-ла) нашу пропозицію — і ми неймовірно раді, що ти зовсім скоро станеш частиною команди IT SmartFlex.<br />
          <strong>Твоя позиція:</strong> <span className={styles.variable}>{position || "@position"}</span><br />
          <strong>Команда:</strong> <span className={styles.variable}>{teamName || "@team"}</span><br />
          <strong>Напрямок:</strong> <span className={styles.variable}>{direction || "@direction"}</span><br />
          <strong>Перший робочий день:</strong> <span className={styles.variable}>{firstDate ? dayjs(firstDate).format("DD.MM.YYYY") : "@date"}</span>
        </p>
      </section>
      <section>
        <h2 className={styles.h2}>План дій перед стартом</h2>
        <ol className={styles.ol}>
          <li>
            <strong>Підтвердження та офіційності</strong>
            <ul className={styles.ul}>
              <li>Офер прийнято, перевірка Служби Безпеки пройдена успішно!</li>
              <li>Готуємо документи (Гіг-контракт, Трудовий Договір, Заява на прийом) для підпису онлайн на <a href="https://document.online/">Document.online</a>.</li>
              <li>Підписання через ЕЦП або застосунок Дія.</li>
            </ul>
          </li>
          <li>
            <strong>Документи</strong>
            <ul className={styles.ul}>
              <li>Диплом про освіту</li>
              <li>Свідоцтво про шлюб</li>
              <li>Свідоцтва дітей до 16 років – для привітань</li>
              <li>Номер Vodafone та фото сімкарти (серійний номер) для корпоративного тарифу</li>
              <li>Відкрити рахунок у Райффайзен банк, надати реквізити (інструкція у вкладенні)</li>
              <li>Фото для перепустки (на світлому фоні) – якщо ти в Києві</li>
              <li>Місто, відділення Нової пошти, ПІБ та номер телефону отримувача (для відправки техніки, WelcomeBox)</li>
              <li>ПІБ, номер телефона і дата народження контактної особи/родича</li>
            </ul>
            <p className={styles.em}><em>Очікуємо документи та інформацію протягом тижня.</em></p>
          </li>
          <li>
            <strong>Готуємо техніку</strong>
            <ul className={styles.ul}>
              <li>Колеги з ІТ відділу готують ноутбук та все необхідне.</li>
              <li>Доставка Новою Поштою або самовивіз з офісу (м. Київ, бульвар Вацлава Гавела, 6, БЦ ”Сігма”).</li>
              <li>Підписання Акту приймання-передачі на Document.online.</li>
            </ul>
          </li>
          <li>
            <strong>Buddy support</strong>
            <ul className={styles.ul}>
              <li>Перед стартом з тобою зв’яжеться твій buddy — колега, який допоможе адаптуватися, познайомить з командою, відповість на питання.</li>
            </ul>
          </li>
          <li>
            <strong>Вітання від нас</strong>
            <ul className={styles.ul}>
              <li>Протягом першого місяця очікуй welcome box — подарунок із корисними дрібничками.</li>
            </ul>
          </li>
        </ol>
      </section>
      <section>
        <h2 className={styles.h2}>Додаткова інформація</h2>
        <p className={styles.p}>
          Більш детальну інформацію щодо роботи ти отримаєш наступним листом.<br />
          Якщо є питання — напиши мені в телеграм {telegram ? (
            <a href={`https://t.me/${telegram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className={styles.variable}>@{telegram.replace(/^@/, "")}</a>
          ) : (
            <span className={styles.variable}>@telegram</span>
          )}.<br />
          Ми завжди поруч і дуже чекаємо знайомства!<br />
          Приєднуйся до нас у LinkedIn і стеж за новинами компанії.
        </p>
      </section>
    </main>
  );
} 