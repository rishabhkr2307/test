import {Link, Navigate} from 'react-router-dom'
import {useAuth} from './authcontext'
import Toggle from './ThemeToggle'

export default function LandingPage(){
    const {user, loading}= useAuth()

    if(loading)
        return <div className='center muted'>Loading...</div>
    if(user)
        return <Navigate to="/dashboard" replace/>
    
    return(
        <div className='landing-wrap'>
            <nav className='landing-nav anim=top speed-fast'>
                <span className='brand'>Thinking Canvas</span>
                <div className='landing-nav-actions'>
                    <Toggle/>
                    <Link to="/register" className="btn nav-btn-rimary">Get Started</Link>
                </div>
            </nav>
            <header className='landing-hero slide-up'>
                <div className='hero-badge anim-down speed-fast delay-1'>Real Time Collaborative Platform</div>
                <h1 className='hero-heading anim-left speed-normal delay-2'>Thing visually <br />Work Together in Real Time</h1>
                <p className='hero-subheading anim-right speed-normal delay-1'>
                    A minimalist infinite canvas made for instant brainstorming, system diagramming and friction-free team collaboration
                </p>
                <div className='hero-cta-group anim-down speed-fast delay-4'>
                    <Link to='/register'>Start Drawing</Link>
                    <p>OR</p>
                    <Link to='/login'>Sign in to a Room</Link>
                </div>
            </header>
           <section className="preview-container anim-scale speed-slow delay-4">
                <div className="preview-window card">
                    <div className="preview-bar">
                        <span className="preview-bar-title">room-x89f2a — Thinking Canvas</span>
                    </div>

                    <div className="mock-canvas">
                        <svg className="mock-svg-layer" viewBox="0 0 1000 380" preserveAspectRatio="none" fill="none">
                            <path d="M 230 130 L 420 130" stroke="var(--muted)" strokeWidth="2" strokeDasharray="6 6" />
                            <path d="M 580 230 L 750 170" stroke="var(--muted)" strokeWidth="2" />
                            <polygon points=",170 738,163 740,175" fill="var(--muted)" />
                        </svg>
                        <div className="mock-shape rect" style={{ top: '100px', left: '80px' }}>
                            <span>Shape 1</span>
                        </div>
                        <div className="mock-shape diamond" style={{ top: '95px', left: '420px' }}>
                            <span>Shape 2</span>
                        </div>

                        <div className="mock-shape circle" style={{ top: '140px', left: '750px' }}>
                            <span>Shape 3</span>
                        </div>
                        <div className="mock-cursor cursor-purple" style={{ top: '115px', left: '260px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5">
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className="cursor-label purple">User 1</span>
                        </div>
                        <div className="mock-cursor cursor-green" style={{ top: '185px', left: '620px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#22c55e" stroke="#ffffff" strokeWidth="1.5">
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className="cursor-label green">User 2</span>
                        </div>
                        <div className="mock-cursor cursor-blue" style={{ top: '255px', left: '350px' }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="#3b82f6" stroke="#ffffff" strokeWidth="1.5">
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className="cursor-label blue">User 3</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className='features'>
                <div className='feature-card card anim-left speed-normal delay-3'>
                    <h3>Low latency Sync</h3>
                    <p className='muted'>
                        Instant element mergin and dynamic cursor tracking powered by real-time WebSocket archtechture.
                    </p>
                </div>
                <div className='feature-card card anim-left speed-normal delay-3'>
                    <h3>Protected Workspaces</h3>
                    <p className='muted'>
                        Create a passowrd protected rooms or share direct invite links wth full owner admin controls
                    </p>
                </div>
                <div className='feature-card card anim-left speed-normal delay-3'>
                    <h3>Public view-pnly Sharing</h3>
                    <p className='muted'>
                        Present a finised visual ideas cleanly to clients and reviewers using secure read-only URL tokens
                    </p>
                </div>
            </section>
            <footer className='Footer muted'>
                <p>&copy; 2026 Thinking Canvas. BUilt for distraction-free visual collaboration</p>
            </footer>
        </div>
    )
}