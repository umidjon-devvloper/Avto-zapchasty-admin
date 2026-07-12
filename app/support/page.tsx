import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yordam va qo'llab-quvvatlash — Zapchasty",
  description: "Zapchasty foydalanuvchilari uchun yordam markazi va bog'lanish ma'lumotlari.",
};

export default function SupportPage() {
  return (
    <div className="container-page py-10">
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Yordam / Поддержка</h1>
          <p className="mt-2 text-muted">
            Savol yoki muammo bo&apos;lsa, biz bilan bog&apos;laning — 24 soat ichida javob beramiz.
          </p>
        </div>

        <section className="card space-y-3 p-6">
          <h2 className="text-lg font-bold text-ink">Bog&apos;lanish / Контакты</h2>
          <p className="text-ink">
            📧 Email:{' '}
            <a href="mailto:zapchastyzapchasty@gmail.com" className="font-semibold text-amber-600 hover:underline">
              zapchastyzapchasty@gmail.com
            </a>
          </p>
          <p className="text-muted text-sm">
            Xat yozayotganda telefon raqamingiz va muammoning qisqacha tavsifini kiriting.
            <br />
            При обращении укажите ваш номер телефона и краткое описание проблемы.
          </p>
        </section>

        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-bold text-ink">Ko&apos;p so&apos;raladigan savollar / Частые вопросы</h2>

          <div>
            <h3 className="font-semibold text-ink">E&apos;lon qanday beriladi? / Как разместить объявление?</h3>
            <p className="mt-1 text-sm text-muted">
              Ro&apos;yxatdan o&apos;ting → &quot;E&apos;lon berish&quot; tugmasini bosing → rasm, kategoriya, narx va
              tavsifni kiriting. E&apos;lon tekshiruvdan so&apos;ng chiqadi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-ink">E&apos;lonim nega ko&apos;rinmayapti? / Почему не видно моё объявление?</h3>
            <p className="mt-1 text-sm text-muted">
              Yangi e&apos;lonlar qisqa moderatsiyadan o&apos;tadi (odatda bir necha daqiqa). Rad etilsa, sabab
              bildirishnomada ko&apos;rsatiladi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-ink">Hisobni qanday o&apos;chiraman? / Как удалить аккаунт?</h3>
            <p className="mt-1 text-sm text-muted">
              Mobil ilovada: Profil → pastdagi &quot;Hisobni o&apos;chirish&quot; tugmasi. Hisobingiz, barcha
              e&apos;lonlaringiz va xabarlaringiz butunlay o&apos;chiriladi.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-ink">To&apos;lov qanday amalga oshiriladi? / Как происходит оплата?</h3>
            <p className="mt-1 text-sm text-muted">
              Zapchasty — e&apos;lonlar maydonchasi. Xaridor va sotuvchi to&apos;lovni o&apos;zaro kelishadi.
              Oldindan to&apos;lov qilmang — mahsulotni ko&apos;rib, tekshirib oling.
            </p>
          </div>
        </section>

        <p className="text-center text-sm text-muted">
          Maxfiylik siyosati: <a href="/privacy" className="text-amber-600 hover:underline">zapchasty.uz/privacy</a>
        </p>
      </div>
    </div>
  );
}
