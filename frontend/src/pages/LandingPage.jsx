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
            <nav className='landing-nav'>
                <span className='brand'>Thanking Canvas</span>
                <div className='landing-nav-actions'>
                    <Toggle/>
                    <Link to="/register" className="btn nav-btn-rimary">Get Started</Link>
                </div>
            </nav>
            <header className='landing-hero slide-up'>
                <div className='hero-badge'>Real Time Collaborative Platform</div>
                <h1 className='hero-heading'>Thing visually <br />Work Together in Real Time</h1>
                <p className='hero-subheading'>
                    A minimalist infinite canvas made for instant brainstorming, system diagramming and friction-free team collaboration
                </p>
                <div className='hero-cta-group'>
                    <Link to='/register'>Start Drawing</Link>
                    <Link to='/login'>Sign in to a Room</Link>
                </div>
            </header>
            <section className='preview-container slide-up delay-1'>
                <div className='preview-window card'>
                    <div className='preview-bar'>
                        <div className='window-dots'>
                            <span className='dot red'></span>
                            <span className='dot yellow'></span>
                            <span className='dot green'></span>
                        </div>
                        <span className='preview-bar-title'>Room-XG178F - Thinking Canvas</span>
                    </div>
                    <div className='mock-canvas'>
                        <svg className='mock-svg-layer' viewBox='0 0 1000 380' preserveAspectRatio='none' fill='none'>
                            <path d="M 230 130 L 420 130" stroke='var(--muted)' strokeWidth="2"/>
                            <path d="M 580 130 L 740 170" stroke='var(--muted)' strokeWidth="2"/>
                            <path d="M 58- 165 L 500 240" stroke='var(--muted)' strokeWidth="2"/>
                            <polygon points='750,170 738,163 740,175' fill='var(--muted)'/>
                        </svg>
                        <div className='mockshape rect' style={{top:'100px', left:'80px'}}>
                            <span>Client App</span>
                        </div>
                        <div className='mockshape diamond' style={{top:'95px', left:'450px'}}>
                            <span>Websocket App</span>
                        </div>
                        <div className='mockshape circle' style={{top:'140px', left:'750px'}}>
                            <span>PostgreSQL</span>
                        </div>
                        <div className='mcursor cursor-purple' style={{top:'115px', left:'260px'}}>
                            <svg width='18px' height='18px' viewBox='0 0 24 24' fill='purple' stroke='white' strokeWidth='15px'>
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className='cursor-label purple'>User 1</span>
                        </div>
                        <div className='mcursor cursor-green' style={{top:'185px', left:'660px'}}>
                            <svg width='18px' height='18px' viewBox='0 0 24 24' fill='green' stroke='white' strokeWidth='15px'>
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className='cursor-label purple'>User 2</span>
                        </div>
                        <div className='mcursor cursor-blue' style={{top:'285px', left:'360px'}}>
                            <svg width='18px' height='18px' viewBox='0 0 24 24' fill='blue' stroke='white' strokeWidth='15px'>
                                <path d="M3 3l7 18 3-7 7-3L3 3z"/>
                            </svg>
                            <span className='cursor-label purple'>User 3</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className='features slide-up delay-2'>
                <div className='feature-card card'>
                    <h3>Low latency Sync</h3>
                    <p className='muted'>
                        Instant element mergin and dynamic cursor tracking powered by real-time WebSocket archtechture.
                    </p>
                </div>
                <div className='feature-card card'>
                    <h3>Protected Workspaces</h3>
                    <p className='muted'>
                        Create a passowrd protected rooms or share direct invite links wth full owner admin controls
                    </p>
                </div>
                <div className='feature-card card'>
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