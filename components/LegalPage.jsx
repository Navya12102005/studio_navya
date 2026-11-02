export default function LegalPage({title,children}){
 return <main className="legal-page"><a href="/">Back to portfolio</a><p className="legal-draft">Draft for owner review. Not final legal terms.</p><h1>{title}</h1>{children}<nav aria-label="Legal pages"><a href="/privacy">Privacy Policy (draft)</a><a href="/terms">Terms of Service (draft)</a></nav></main>;
}
