import { useParams } from 'react-router-dom';
import PostDetail from '@/components/PostDetail';

export default function PostPage() {
  const { id } = useParams<{ id: string }>();

  return <PostDetail key={id} />;
}