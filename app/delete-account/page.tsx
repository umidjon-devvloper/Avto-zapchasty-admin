import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Hisobni o'chirish — Zapchasty",
  description: "Zapchasty ilovasida hisobni va unga bog'liq ma'lumotlarni o'chirish yo'riqnomasi.",
};

export default function DeleteAccountPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">
            Zapchasty — hisobni o&apos;chirish / Удаление аккаунта
          </h1>
          <p className="mt-2 text-muted">
            Zapchasty ilovasidagi hisobingizni va unga bog&apos;liq barcha ma&apos;lumotlarni istalgan
            vaqtda butunlay o&apos;chirishingiz mumkin.
          </p>
        </div>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">Ilova ichida o&apos;chirish / Удаление в приложении</h2>
          <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
            <li>Zapchasty ilovasini oching va hisobingizga kiring / Откройте приложение Zapchasty и войдите в аккаунт</li>
            <li>Pastdagi <b>Profil</b> bo&apos;limiga o&apos;ting / Перейдите на вкладку <b>Профиль</b></li>
            <li>Sahifaning eng pastiga aylantiring / Прокрутите страницу вниз</li>
            <li>Qizil <b>«Hisobni o&apos;chirish» / «Удалить аккаунт»</b> tugmasini bosing / Нажмите красную кнопку</li>
            <li>Ikki marta tasdiqlang — hisobingiz darhol o&apos;chiriladi / Подтвердите дважды — аккаунт будет удалён немедленно</li>
          </ol>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">Nimalar o&apos;chiriladi / Какие данные удаляются</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>Hisob (telefon raqami, ism) / Аккаунт (номер телефона, имя)</li>
            <li>Barcha e&apos;lonlaringiz va rasmlari / Все ваши объявления</li>
            <li>Barcha xabarlaringiz va suhbatlar / Все сообщения и переписки</li>
            <li>Push-bildirishnoma tokenlari / Push-токены</li>
          </ul>
          <p className="text-sm text-muted">
            O&apos;chirish <b>darhol va qaytarib bo&apos;lmas</b> tarzda amalga oshadi — hech qanday ma&apos;lumot
            saqlab qolinmaydi. / Удаление происходит <b>немедленно и безвозвратно</b> — никакие данные не сохраняются.
          </p>
        </section>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">Ilovaga kira olmayapsizmi? / Нет доступа к приложению?</h2>
          <p className="text-sm text-muted">
            Hisobni o&apos;chirishni email orqali ham so&apos;rashingiz mumkin — ro&apos;yxatdan o&apos;tgan telefon
            raqamingizni ko&apos;rsatib xat yuboring, 7 kun ichida o&apos;chiramiz: /
            Вы можете запросить удаление по email — укажите номер телефона, удалим в течение 7 дней:{' '}
            <a href="mailto:zapchastyzapchasty@gmail.com" className="font-semibold text-amber-600 hover:underline">
              zapchastyzapchasty@gmail.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
