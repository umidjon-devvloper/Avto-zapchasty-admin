import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maxfiylik siyosati — Zapchasty',
  description: "Zapchasty maxfiylik siyosati: qanday ma'lumotlar yig'iladi va qanday ishlatiladi.",
};

export default function PrivacyPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Maxfiylik siyosati / Политика конфиденциальности</h1>
          <p className="mt-2 text-sm text-muted">Oxirgi yangilanish / Последнее обновление: 12.07.2026</p>
        </div>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">1. Qanday ma&apos;lumotlar yig&apos;iladi / Какие данные мы собираем</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Telefon raqami va ismingiz — ro&apos;yxatdan o&apos;tish uchun / Номер телефона и имя — для регистрации</li>
            <li>E&apos;lon ma&apos;lumotlari: rasm, tavsif, narx, shahar / Данные объявлений: фото, описание, цена, город</li>
            <li>Xabarlar — sotuvchi va xaridor o&apos;rtasidagi yozishmalar / Сообщения между покупателем и продавцом</li>
            <li>Push-bildirishnoma tokeni — xabarnomalar yuborish uchun / Push-токен для уведомлений</li>
          </ul>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">2. Ma&apos;lumotlar qanday ishlatiladi / Как используются данные</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Xizmat ko&apos;rsatish: e&apos;lonlarni joylash, qidiruv, chat / Работа сервиса: объявления, поиск, чат</li>
            <li>Telefon raqamingiz faqat siz e&apos;londa ko&apos;rsatsangiz boshqalarga ko&apos;rinadi / Номер виден другим только если вы указали его в объявлении</li>
            <li>Ma&apos;lumotlaringiz uchinchi shaxslarga sotilmaydi / Данные не продаются третьим лицам</li>
            <li>Reklama maqsadida kuzatuv olib borilmaydi / Мы не отслеживаем вас в рекламных целях</li>
          </ul>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">3. Ma&apos;lumotlarni saqlash / Хранение данных</h2>
          <p className="text-sm text-muted">
            Ma&apos;lumotlar xavfsiz serverlarda shifrlangan aloqa (HTTPS) orqali saqlanadi. Parollar
            xeshlangan holda saqlanadi.
            <br />
            Данные хранятся на защищённых серверах, передача — только по HTTPS. Пароли хранятся в
            хешированном виде.
          </p>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">4. Hisobni o&apos;chirish / Удаление аккаунта</h2>
          <p className="text-sm text-muted">
            Mobil ilovada Profil → &quot;Hisobni o&apos;chirish&quot; orqali hisobingizni istalgan vaqtda butunlay
            o&apos;chirishingiz mumkin. Bunda barcha shaxsiy ma&apos;lumotlaringiz, e&apos;lonlaringiz va
            xabarlaringiz qaytarib bo&apos;lmas tarzda o&apos;chiriladi.
            <br />
            Вы можете полностью удалить аккаунт в приложении: Профиль → «Удалить аккаунт». Все ваши
            личные данные, объявления и сообщения удаляются безвозвратно.
          </p>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">5. Bog&apos;lanish / Контакты</h2>
          <p className="text-sm text-muted">
            Savollar uchun / По вопросам:{' '}
            <a href="mailto:zapchastyzapchasty@gmail.com" className="font-semibold text-amber-600 hover:underline">
              zapchastyzapchasty@gmail.com
            </a>
            <br />
            Yordam markazi / Центр поддержки:{' '}
            <a href="/support" className="font-semibold text-amber-600 hover:underline">
              zapchasty.uz/support
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
