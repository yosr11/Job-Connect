import { useState } from 'react'
import { Briefcase, Users, Zap, ArrowRight, CheckCircle } from 'lucide-react'
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const [activeView, setActiveView] = useState('home')
  const navigate = useNavigate();
const handleNavigation = (view) => {
  navigate(`/${view}`);
};
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #60a5fa 100%)', position: 'relative', overflow: 'hidden'}}>
      {/* Animated background elements */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', animation: 'float 6s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '10%', width: 150, height: 150, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', animation: 'float 8s ease-in-out infinite reverse' }} />
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feature-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }
        .btn-primary {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        .btn-primary::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        .btn-primary:hover::before {
          width: 300px;
          height: 300px;
        }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px' ,width:'1200px'}}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 60, animation: 'slideIn 0.8s ease-out' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 20 }}>
            <Briefcase size={48} color="white" strokeWidth={2.5} />
            <h1 style={{ fontSize: 56, margin: 0, color: 'white', fontWeight: 800, letterSpacing: '-2px' }}>
              Job<span style={{ color: '#fbbf24' }}>Connect</span>
            </h1>
          </div>
          <p style={{ fontSize: 24, color: 'rgba(255,255,255,0.95)', maxWidth: 700, margin: '0 auto', fontWeight: 300 }}>
            La plateforme qui révolutionne le recrutement en connectant talents et opportunités
          </p>
        </div>

        {/* Main Card */}
        <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderRadius: 24, padding: 48, boxShadow: '0 25px 50px rgba(0,0,0,0.25)', marginBottom: 48, animation: 'slideIn 1s ease-out' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 42, margin: 0, color: '#1f2937', fontWeight: 700, lineHeight: 1.2, marginBottom: 20 }}>
                Trouvez votre prochaine opportunité
              </h2>
              <p style={{ color: '#6b7280', fontSize: 18, lineHeight: 1.7, marginBottom: 32 }}>
                JobConnect utilise l'intelligence artificielle pour matcher les meilleurs talents avec les entreprises qui recrutent. Simple, rapide et efficace.
              </p>
              

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16,  }}>
                <button 
                  onClick={() => handleNavigation('login')} 
                  className="btn-primary"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)', color: 'white', border: 'none', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, position: 'relative', zIndex: 1 , width : '500px' }}
                >
                  Se connecter <ArrowRight size={20} />
                </button>
                 <div style={{ display: 'flex', gap: 16 }}>
                  <button 
                    onClick={() => handleNavigation('register-candidat')}
                    className="btn-primary"
                    style={{ background: 'white', color: '#3b82f6', border: '2px solid #3b82f6', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600, position: 'relative', zIndex: 1, flex: 1 , width:'250px' }}
                  >
                    Inscription Candidat
                  </button>
                  <button 
                    onClick={() => handleNavigation('register-recruteur')}
                    className="btn-primary"
                    style={{ background: 'white', color: '#3b82f6', border: '2px solid #3b82f6', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600, position: 'relative', zIndex: 1, flex: 1 , width:'250px' }}
                  >
                    Inscription Recruteur
                  </button>
                </div>
                
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: 380, 
                background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #60a5fa 100%)', 
                borderRadius: 20, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                flexDirection: 'column',
                gap: 20,
                color: 'white',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', top: 20, right: 20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                <div style={{ position: 'absolute', bottom: 30, left: 30, width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
                <Zap size={80} strokeWidth={2} />
                <div style={{ fontSize: 28, fontWeight: 700, textAlign: 'center', zIndex: 1 }}>
                  Connexion Instantanée
                </div>
                <div style={{ fontSize: 16, opacity: 0.9, textAlign: 'center', maxWidth: '80%', zIndex: 1 }}>
                  Talents & Opportunités
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, animation: 'slideIn 1.2s ease-out' }}>
          {[
            { icon: <Users size={40} />, title: 'Pour les Candidats', desc: 'Créez votre profil et laissez les opportunités venir à vous', color: '#3b82f6' },
            { icon: <Briefcase size={40} />, title: 'Pour les Recruteurs', desc: 'Accédez à un vivier de talents qualifiés et motivés', color: '#60a5fa' },
            
          ].map((feature, i) => (
            <div 
              key={i}
              className="feature-card"
              style={{ 
                background: 'white', 
                padding: 32, 
                borderRadius: 16, 
                textAlign: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                width: '550px'
              }}
            >
              <div style={{ color: feature.color, marginBottom: 16, display: 'flex', justifyContent: 'center' }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: '#1f2937', marginBottom: 12 }}>
                {feature.title}
              </h3>
              <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}