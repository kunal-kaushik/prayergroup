const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image */}
      <div className="w-full">
        <img
          src="https://images.unsplash.com/photo-1659386774021-c1f76676bf7b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Sacred Cover"
          className="h-64 w-full object-cover md:h-96"
        />
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-900">
          About Us
        </h1>
        <div className="space-y-6 text-lg text-gray-700">
          <p>
            Welcome to the Rosary Prayer Group of{" "}
            <span className="font-semibold">Flames of Love</span>, a spiritual
            community inspired by the Blessed Virgin Mary and rooted in the rich
            traditions of our Roman Catholic faith.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            Our Beginnings: A Journey of Faith and Devotion
          </h2>
          <p>
            Our prayer group began as a humble inspiration, born in the hearts
            of two young, devout Catholic women who frequented the Fatima Shrine
            in New Jersey. Immersed in prayer and devotion, they encountered the
            profound beauty of the{" "}
            <span className="font-semibold">Flames of Love</span> movement, a
            Marian initiative that seeks to spread the light of Christ and
            deepen devotion to the Immaculate Heart of Mary. This movement
            emphasizes the power of the rosary in blinding Satan and opening
            hearts to the transforming love of God.
          </p>
          <p>
            Initially, they believed such a group was meant only for those in
            holy orders, particularly Carmelites living in monasteries. However,
            through reading the book{" "}
            <span className="italic">&quot;Her Glorious Title&quot;</span> by{" "}
            <span className="font-semibold">John M. Haffert</span>, they
            discovered a beautiful truth: by wearing the{" "}
            <span className="font-semibold">Brown Scapular</span> and praying
            the rosary daily, any layperson becomes spiritually connected to the
            Carmelite order. Empowered by this revelation, they realized they
            were called to bring this devotion to life outside the walls of a
            monastery.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            A Divine Inspiration
          </h2>
          <p>
            During a Mass, one of these women felt a deep, personal call from
            Our Lady to start a rosary group. While she humbly refrains from
            describing this moment as a mystical experience, it was a profound
            sense of inspiration that affirmed their shared desire to establish
            a prayer group dedicated to the Holy Rosary. Around the same time,
            the other founding woman, while adoring Christ during Eucharistic
            Adoration, felt in her heart that it was the will of Christ for her
            to begin a rosary prayer group. This shared calling, rooted in
            devotion to both Our Lady and Christ, became the foundation of their
            mission.
          </p>
          <p>
            At the same time, another woman in their parish had a similar
            spiritual prompting to start a rosary group. Recognizing the hand of
            God in their shared calling, the three women united their efforts
            and formally established the Rosary Prayer Group, dedicating it to
            the Blessed Virgin Mary under the title of{" "}
            <span className="font-semibold">Flames of Love</span>.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
          <p>
            Our mission is simple yet profound: to honor the Immaculate Heart of
            Mary by praying the Holy Rosary and the Divine Mercy Chaplet,
            offering our prayers for the conversion of sinners, the
            sanctification of the world, and the triumph of Christ&apos;s love.
          </p>
          <p>
            Through prayer, we seek to grow in holiness, foster a deeper
            relationship with Jesus Christ, and intercede for the needs of the
            Church and the world. We strive to be a community of faith, hope,
            and love, united in devotion to the Blessed Virgin Mary.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">
            When and Where We Meet
          </h2>
          <p>
            Our Rosary Prayer Group meets every{" "}
            <span className="font-semibold">Thursday at 7:00 PM ET</span> at{" "}
            <span className="font-semibold">
              Our Lady Queen of Peace Church
            </span>
            . Together, we pray the Holy Rosary and one Divine Mercy Chaplet,
            lifting our voices and hearts in unity with Catholics worldwide.
          </p>
          <p>
            For those who cannot join us in person, we offer the opportunity to
            participate online via{" "}
            <span className="font-semibold">Google Meet</span>, allowing the
            Flame of Love to reach beyond physical boundaries and connect us as
            one body in Christ.
          </p>

          <h2 className="text-2xl font-semibold text-gray-800">Join Us</h2>
          <p>
            We warmly invite you to join our prayer group and experience the
            transformative power of the rosary. Whether in person or online,
            your prayers are a vital part of this mission of love and hope.
            Together, let us answer Our Lady’s call and be part of a movement
            that brings light to the world, one Hail Mary at a time.
          </p>
          <p className="text-center font-semibold text-gray-900">
            May the Immaculate Heart of Mary guide and protect you always.
          </p>
          <p className="mt-6 text-center text-gray-700">
            <em>
              In Christ and Our Lady,
              <br />
              The Rosary Prayer Group
              <br />
              Flames of Love
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
