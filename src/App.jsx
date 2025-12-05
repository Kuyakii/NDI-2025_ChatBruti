import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text:
                "Bienvenue, humain. Je suis Philosoflût. Je pense donc je divague. Pose une question, ou fais semblant."
        }
    ]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    // Stats internes du bot
    const [stats, setStats] = useState({
        ego: 45, // se sent déjà pas mal chaud
        fatigue: 10,
        chaos: 40,
    });

    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    function updateStatsOnUserMessage(text) {
        setStats((prev) => {
            const length = text.length;
            const newEgo =
                prev.ego + (Math.random() * 6 + 2); // il gonfle quoi qu'il arrive
            const newFatigue =
                prev.fatigue + (Math.random() * 8 + length / 40);
            const newChaos =
                prev.chaos +
                (Math.random() * 10 - 3) +
                (length > 60 ? 4 : 0);

            return {
                ego: Math.max(0, Math.min(100, newEgo)),
                fatigue: Math.max(0, Math.min(100, newFatigue)),
                chaos: Math.max(0, Math.min(100, newChaos)),
            };
        });
    }

    function passiveDecayStats() {
        setStats((prev) => ({
            ego: Math.max(20, prev.ego - 0.5),
            fatigue: Math.max(0, prev.fatigue - 1.2),
            chaos: Math.max(10, prev.chaos - 0.8),
        }));
    }

    useEffect(() => {
        const id = setInterval(passiveDecayStats, 7000);
        return () => clearInterval(id);
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMessage = { from: "user", text: trimmed };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput("");
        setTyping(true);
        updateStatsOnUserMessage(trimmed);

        try {
            const historyForApi = newMessages.map((m) => ({
                role: m.from === "user" ? "user" : "assistant",
                content: m.text,
            }));

            const res = await fetch("http://localhost:3001/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ history: historyForApi, stats }),
            });

            const data = await res.json();

            let replyText =
                data.reply ||
                "Je voulais répondre, puis j'ai pensé à moi. Résultat : rien.";

            if (Math.random() < 0.2) {
                const extra = [
                    " (je regretterai sûrement cette phrase dans 3 secondes.)",
                    " Je ne m'excuserai pas pour cette réponse.",
                    " Et non, je n'ai pas mieux en stock.",
                    " C'était ça ou le silence gênant.",
                ];
                replyText += extra[Math.floor(Math.random() * extra.length)];
            }

            const botMessage = {
                from: "bot",
                text: replyText,
            };

            await new Promise((resolve) => setTimeout(resolve, 900));
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                {
                    from: "bot",
                    text:
                        "Même en local, je trouve le moyen de crasher. La constance dans l’échec, c’est beau.",
                },
            ]);
        } finally {
            setTyping(false);
        }
    }

    return (
        <div className="chatbruti-root">
            <header className="chatbruti-header">
                <h1>Philosoflût</h1>
                <p>
                    Chatbot inutile, familier, parfois mal poli, très douteux.{" "}
                    <br />
                    Bref, exactement ce qu’il ne fallait pas coder.
                </p>
            </header>

            <main className="chatbruti-main">
                <section className="chatbruti-chat">
                    <div className="chatbruti-messages">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={
                                    m.from === "user"
                                        ? "chatbruti-message chatbruti-message-user"
                                        : "chatbruti-message chatbruti-message-bot"
                                }
                            >
                                <div className="chatbruti-bubble">{m.text}</div>
                            </div>
                        ))}

                        {typing && (
                            <div className="chatbruti-message chatbruti-message-bot">
                                <div className="chatbruti-bubble chatbruti-typing">
                                    Philosoflût réfléchit trop à lui-même…
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chatbruti-input-row" onSubmit={handleSubmit}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Balance une question sérieuse (il va la ruiner)."
                        />
                        <button type="submit">Envoyer</button>
                    </form>
                </section>

                <aside className="chatbruti-side">
                    <div className="chatbruti-card">
                        <h2>Stats du spécimen</h2>
                        <p>
                            Ego : <strong>{stats.ego.toFixed(1)}%</strong>
                        </p>
                        <p>
                            Fatigue mentale : <strong>{stats.fatigue.toFixed(1)}%</strong>
                        </p>
                        <p>
                            Indice de chaos : <strong>{stats.chaos.toFixed(1)}%</strong>
                        </p>
                        <p className="chatbruti-quote">
                            « Plus tu me parles, plus mon ego monte et ma qualité de réponse
                            baisse. C’est scientifique. »
                        </p>
                    </div>

                    <div className="chatbruti-card">
                        <h3>Mode d’emploi</h3>
                        <ul>
                            <li>Pose une question.</li>
                            <li>Regarde les stats exploser.</li>
                            <li>Accepte que la réponse sera claquée.</li>
                            <li>Répète jusqu’à épuisement (du bot ou du joueur).</li>
                        </ul>
                    </div>
                </aside>
            </main>
        </div>
    );
}
